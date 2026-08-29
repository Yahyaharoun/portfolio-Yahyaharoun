import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link, Svg, Path, Circle, Polyline } from '@react-pdf/renderer';

const ACCENT_COLOR = '#6D5DFC';
const BACKGROUND_LIGHT = '#FFFFFF';
const SIDEBAR_BG = '#EEF2FF';
const CARD_BG = '#F8FAFC';
const TEXT_DARK = '#0F172A';
const TEXT_MUTED = '#475569';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: BACKGROUND_LIGHT,
    fontFamily: 'Helvetica',
  },
  sidebar: {
    width: '32%',
    backgroundColor: SIDEBAR_BG,
    color: TEXT_DARK,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #E2E8F0',
  },
  main: {
    width: '68%',
    padding: 30,
    backgroundColor: BACKGROUND_LIGHT,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 16,
    border: `3px solid ${ACCENT_COLOR}`,
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: TEXT_DARK,
  },
  title: {
    fontSize: 11,
    textAlign: 'center',
    color: ACCENT_COLOR,
    marginBottom: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  sectionTitleSidebar: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    borderBottom: `1px solid ${ACCENT_COLOR}`,
    paddingBottom: 4,
    marginBottom: 12,
    marginTop: 24,
    textTransform: 'uppercase',
  },
  contactItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
    color: ACCENT_COLOR,
  },
  contactText: {
    fontSize: 9,
    color: TEXT_MUTED,
  },
  contactLink: {
    fontSize: 9,
    color: TEXT_MUTED,
    textDecoration: 'none',
  },
  skillCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: TEXT_DARK,
    marginBottom: 6,
    marginTop: 10,
  },
  skillList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillBadge: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    padding: '3px 6px',
    borderRadius: 4,
    fontSize: 8,
    color: TEXT_MUTED,
    marginBottom: 4,
    marginRight: 4,
  },
  languageItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    marginBottom: 6,
    color: TEXT_MUTED,
  },
  sectionTitleMain: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    borderBottom: `2px solid ${ACCENT_COLOR}`,
    paddingBottom: 4,
    marginBottom: 16,
    marginTop: 24,
    textTransform: 'uppercase',
  },
  summaryCard: {
    backgroundColor: CARD_BG,
    padding: 12,
    borderRadius: 8,
    border: '1px solid #E2E8F0',
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: TEXT_MUTED,
  },
  experienceItem: {
    marginBottom: 16,
    backgroundColor: CARD_BG,
    padding: 12,
    borderRadius: 8,
    border: '1px solid #E2E8F0',
  },
  experienceHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  experienceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  experienceDate: {
    fontSize: 9,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
  },
  experienceOrg: {
    fontSize: 10,
    fontWeight: 'bold',
    color: TEXT_MUTED,
    marginBottom: 6,
  },
  experienceDesc: {
    fontSize: 9,
    lineHeight: 1.4,
    color: TEXT_MUTED,
  },
  projectItem: {
    marginBottom: 16,
    backgroundColor: CARD_BG,
    padding: 12,
    borderRadius: 8,
    border: '1px solid #E2E8F0',
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 9,
    lineHeight: 1.4,
    color: TEXT_MUTED,
    marginBottom: 6,
  },
  techBadgeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  techBadge: {
    backgroundColor: SIDEBAR_BG,
    color: ACCENT_COLOR,
    padding: '3px 6px',
    borderRadius: 4,
    fontSize: 7,
    marginRight: 4,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  educationItem: {
    marginBottom: 12,
  },
  educationTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  educationInst: {
    fontSize: 9,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  educationYear: {
    fontSize: 8,
    color: ACCENT_COLOR,
    marginTop: 2,
    fontWeight: 'bold',
  }
});

// Icônes SVG pour React-PDF
const IconPhone = () => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke={ACCENT_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IconMail = () => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke={ACCENT_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="22,6 12,13 2,6" fill="none" stroke={ACCENT_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IconLink = () => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke={ACCENT_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke={ACCENT_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface CVDocumentProps {
  profile: any;
  cvData: any;
  experiences: any[];
  projects: any[];
}

export function CVDocument({ profile, cvData, experiences, projects }: CVDocumentProps) {
  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  return (
    <Document title={`CV_${profile?.full_name?.replace(/\s+/g, '_') || 'Yahya_Haroun'}`}>
      <Page size="A4" style={styles.page}>
        
        {/* SIDEBAR */}
        <View style={styles.sidebar}>
          {profile?.avatar_url ? (
            <View style={styles.photoContainer}>
              <Image src={profile.avatar_url} style={styles.photo} />
            </View>
          ) : null}
          
          <Text style={styles.name}>{cvData?.full_name || profile?.full_name || 'Yahya Haroun'}</Text>
          <Text style={styles.title}>{cvData?.professional_title || profile?.title || 'Développeur Full Stack'}</Text>
          
          <View style={{ marginTop: 8 }}>
            <Text style={styles.sectionTitleSidebar}>Contact</Text>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}><IconMail /></View>
              <Text style={styles.contactText}>{profile?.email || "yahyaharoun.657@gmail.com"}</Text>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}><IconPhone /></View>
              <Text style={styles.contactText}>{profile?.phone || "+237 690722465"}</Text>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}><IconPhone /></View>
              <Link src={`https://wa.me/237690722465`} style={styles.contactLink}>WhatsApp: +237 690722465</Link>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}><IconLink /></View>
              <Link src={profile?.linkedin_url || "https://www.linkedin.com/in/yahya-haroun-87a446344"} style={styles.contactLink}>LinkedIn</Link>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}><IconLink /></View>
              <Link src={profile?.github_url || "https://github.com/yahyaharoun"} style={styles.contactLink}>GitHub</Link>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}><IconLink /></View>
              <Link src={profile?.portfolio_url || "https://yahyaharoun.com"} style={styles.contactLink}>Portfolio</Link>
            </View>
          </View>

          {cvData?.skills && cvData.skills.length > 0 ? (
            <View>
              <Text style={styles.sectionTitleSidebar}>Compétences</Text>
              {cvData.skills.map((skillGroup: any, idx: number) => (
                <View key={idx}>
                  <Text style={styles.skillCategory}>{skillGroup.category}</Text>
                  <View style={styles.skillList}>
                    {skillGroup.items.map((item: string, i: number) => (
                      <Text key={i} style={styles.skillBadge}>{item}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {cvData?.languages && cvData.languages.length > 0 ? (
            <View>
              <Text style={styles.sectionTitleSidebar}>Langues</Text>
              {cvData.languages.map((lang: any, idx: number) => (
                <View key={idx} style={styles.languageItem}>
                  <Text>{lang.name}</Text>
                  <Text style={{ color: ACCENT_COLOR, fontWeight: 'bold' }}>{lang.level}</Text>
                </View>
              ))}
            </View>
          ) : null}
          
          {cvData?.education && cvData.education.length > 0 ? (
            <View>
              <Text style={styles.sectionTitleSidebar}>Formations</Text>
              {cvData.education.map((edu: any, idx: number) => (
                <View key={idx} style={styles.educationItem}>
                  <Text style={styles.educationTitle}>{edu.title}</Text>
                  <Text style={styles.educationInst}>{edu.institution}</Text>
                  <Text style={styles.educationYear}>{edu.year}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* MAIN COLUMN */}
        <View style={styles.main}>
          {cvData?.summary ? (
            <View>
              <Text style={[styles.sectionTitleMain, { marginTop: 0 }]}>Profil Professionnel</Text>
              <View style={styles.summaryCard}>
                <Text style={styles.summary}>{cvData.summary}</Text>
              </View>
            </View>
          ) : null}

          {experiences && experiences.length > 0 ? (
            <View>
              <Text style={styles.sectionTitleMain}>Expériences Professionnelles</Text>
              {experiences.map((exp: any, idx: number) => (
                <View key={idx} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.experienceTitle}>{exp.title}</Text>
                    <Text style={styles.experienceDate}>
                      {formatMonthYear(exp.start_date)} - {exp.is_current ? 'Présent' : formatMonthYear(exp.end_date)}
                    </Text>
                  </View>
                  <Text style={styles.experienceOrg}>{exp.organization}</Text>
                  <Text style={styles.experienceDesc}>{exp.description}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {projects && projects.length > 0 ? (
            <View>
              <Text style={styles.sectionTitleMain}>Projets Phares</Text>
              {projects.map((proj: any, idx: number) => (
                <View key={idx} style={styles.projectItem}>
                  <Text style={styles.projectTitle}>{proj.title}</Text>
                  <Text style={styles.projectDesc}>{proj.description}</Text>
                  {proj.technologies && proj.technologies.length > 0 ? (
                    <View style={styles.techBadgeContainer}>
                      {proj.technologies.map((tech: any, i: number) => (
                        <Text key={i} style={styles.techBadge}>{tech.name}</Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {cvData?.custom_sections && cvData.custom_sections.length > 0 ? (
            <View>
              {cvData.custom_sections.map((section: any, idx: number) => (
                <View key={idx}>
                  <Text style={styles.sectionTitleMain}>{section.title}</Text>
                  <View style={styles.summaryCard}>
                    <Text style={styles.summary}>{section.content}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

        </View>

      </Page>
    </Document>
  );
}
