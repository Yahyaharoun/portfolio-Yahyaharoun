import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { CVDocument } from '@/lib/cv/CVDocument';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();

    // 1. Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();

    // 2. Fetch CV data (skills, languages, etc.)
    let { data: cvData } = await supabase
      .from('cv_data')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    // Fallback si cv_data est vide
    if (!cvData) {
      cvData = {
        full_name: profile?.full_name || 'Yahya Haroun',
        professional_title: profile?.title || 'Développeur Full Stack',
        summary: profile?.bio || '',
        skills: [],
        languages: [],
        education: []
      };
    }

    // 3. Fetch experiences
    const { data: experiences } = await supabase
      .from('experiences')
      .select('*')
      .eq('is_published', true)
      .in('type', ['entreprise', 'stage', 'projet', 'entrepreneuriat'])
      .order('start_date', { ascending: false });

    // 4. Fetch featured projects (pour le CV)
    // On utilise is_featured pour l'instant
    const { data: projects } = await supabase
      .from('projects')
      .select('*, technologies:project_technologies(technology:technologies(*))')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true });

    // Formater les technos
    const formattedProjects = projects?.map(p => ({
      ...p,
      technologies: p.technologies?.map((pt: any) => pt.technology) || []
    })) || [];

    // 5. ENVOI DE LA NOTIFICATION PUSH À L'ADMIN
    try {
      const { data: tokensData } = await supabase.from("admin_fcm_tokens").select("token");
      
      if (tokensData && tokensData.length > 0) {
        const tokens = tokensData.map((t) => t.token);
        const { adminMessaging } = await import("@/lib/firebase-admin");
        
        await adminMessaging.sendEachForMulticast({
          tokens,
          notification: {
            title: "CV Téléchargé 📄",
            body: "Quelqu'un vient de télécharger votre CV depuis le Portfolio !",
          },
          webpush: {
            notification: {
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-192x192.png',
              vibrate: [200, 100, 200, 100, 200, 100, 200],
            },
            fcmOptions: {
              link: "/admin/analytics"
            }
          },
          data: {
            url: "/admin/analytics",
            title: "CV Téléchargé 📄",
            body: "Quelqu'un vient de télécharger votre CV depuis le Portfolio !"
          }
        });
      }
    } catch (pushErr) {
      console.error("Erreur d'envoi de notification push CV:", pushErr);
    }

    // Render to stream
    const stream = await renderToStream(
      <CVDocument 
        profile={profile || {}} 
        cvData={cvData} 
        experiences={experiences || []} 
        projects={formattedProjects} 
      />
    );

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CV_${profile?.full_name?.replace(/\s+/g, '_') || 'Yahya_Haroun'}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
