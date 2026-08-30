import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Svg, Path, Polyline } from '@react-pdf/renderer';

const ACCENT_COLOR = '#000000'; // Sleek black for standard CVs
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#4B5563';
const BORDER_COLOR = '#E5E7EB';
const ICON_COLOR = '#6B7280'; // Subtle gray for icons

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: `1px solid ${ACCENT_COLOR}`,
    paddingBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: TEXT_DARK,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  contactContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    rowGap: 8,
  },
  contactItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 9,
    color: TEXT_MUTED,
    textDecoration: 'none',
    marginLeft: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: TEXT_DARK,
    textTransform: 'uppercase',
    borderBottom: `1px solid ${BORDER_COLOR}`,
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 10,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: TEXT_DARK,
  },
  itemBlock: {
    marginBottom: 12,
  },
  itemHeaderRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  itemDate: {
    fontSize: 8,
    color: TEXT_MUTED,
  },
  itemSubtitle: {
    fontSize: 9,
    color: TEXT_DARK,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 9,
    lineHeight: 1.4,
    color: TEXT_MUTED,
  },
  skillsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  skillRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  skillCategory: {
    fontSize: 9,
    fontWeight: 'bold',
    color: TEXT_DARK,
    width: 100,
  },
  skillItems: {
    fontSize: 9,
    color: TEXT_MUTED,
    flex: 1,
  },
  techBadgeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  techBadge: {
    fontSize: 8,
    color: TEXT_DARK,
    marginRight: 6,
    fontStyle: 'italic',
  }
});

// SVG Icons
const IconMail = () => (
  <Svg viewBox="0 0 24 24" width={10} height={10}>
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="22,6 12,13 2,6" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IconPhone = () => (
  <Svg viewBox="0 0 24 24" width={10} height={10}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IconLinkedIn = () => (
  <Svg viewBox="0 0 24 24" width={10} height={10}>
    <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 9h4v12H2z" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IconGitHub = () => (
  <Svg viewBox="0 0 24 24" width={10} height={10}>
    <Path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IconLink = () => (
  <Svg viewBox="0 0 24 24" width={10} height={10}>
    <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IconMapPin = () => (
  <Svg viewBox="0 0 24 24" width={10} height={10}>
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="none" stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);


interface CVDocumentProps {
  profile: any;
  cvData: any;
  experiences: any[];
  projects: any[];
  certifications?: any[];
  evolutions?: any[];
}

export function CVDocument({ profile, cvData, experiences, projects, certifications = [], evolutions = [] }: CVDocumentProps) {
  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  // Custom title as requested
  const jobTitle = 'Étudiant-Entrepreneur • Développeur Full Stack';

  return (
    <Document title={`CV_${profile?.full_name?.replace(/\s+/g, '_') || 'Yahya_Haroun'}`}>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{cvData?.full_name || profile?.full_name || 'YAHYA HAROUN'}</Text>
          <Text style={styles.title}>{jobTitle}</Text>
          
          <View style={styles.contactContainer}>
            <View style={styles.contactItem}>
              <IconMapPin />
              <Text style={styles.contactText}>Yaoundé - Cameroun</Text>
            </View>

            <View style={styles.contactItem}>
              <IconMail />
              <Link src={`mailto:${profile?.email || 'yahyaharoun.657@gmail.com'}`} style={styles.contactText}>
                {profile?.email || 'yahyaharoun.657@gmail.com'}
              </Link>
            </View>

            <View style={styles.contactItem}>
              <IconPhone />
              <Link src={`https://wa.me/237690722465`} style={styles.contactText}>
                WhatsApp : +237 690722465
              </Link>
            </View>

            <View style={styles.contactItem}>
              <IconLink />
              <Link src={profile?.portfolio_url || 'https://yahyaharoun.com'} style={styles.contactText}>
                yahyaharoun.com
              </Link>
            </View>

            <View style={styles.contactItem}>
              <IconLinkedIn />
              <Link src={profile?.linkedin_url || 'https://linkedin.com/in/yahya-haroun-87a446344'} style={styles.contactText}>
                LinkedIn
              </Link>
            </View>

            <View style={styles.contactItem}>
              <IconGitHub />
              <Link src={profile?.github_url || 'https://github.com/yahyaharoun'} style={styles.contactText}>
                GitHub
              </Link>
            </View>
          </View>
        </View>

        {/* SUMMARY */}
        {cvData?.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profil Professionnel</Text>
            <Text style={styles.summary}>{cvData.summary}</Text>
          </View>
        ) : null}

        {/* EXPERIENCES */}
        {experiences && experiences.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expériences Professionnelles</Text>
            {experiences.map((exp: any, idx: number) => (
              <View key={idx} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <Text style={styles.itemDate}>
                    {formatMonthYear(exp.start_date)} - {exp.is_current ? 'Présent' : formatMonthYear(exp.end_date)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.organization}</Text>
                {exp.description ? <Text style={styles.itemDesc}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* DIPLOMES (Evolutions) */}
        {evolutions && evolutions.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diplômes</Text>
            {evolutions.map((evo: any, idx: number) => (
              <View key={idx} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{evo.title}</Text>
                  <Text style={styles.itemDate}>{evo.year}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{evo.organization}</Text>
                {evo.description ? <Text style={styles.itemDesc}>{evo.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* CERTIFICATIONS */}
        {certifications && certifications.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert: any, idx: number) => (
              <View key={idx} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{cert.title}</Text>
                  <Text style={styles.itemDate}>{cert.issue_date || ""}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* PROJECTS */}
        {projects && projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projets Phares</Text>
            {projects.map((proj: any, idx: number) => (
              <View key={idx} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{proj.title}</Text>
                </View>
                <Text style={styles.itemDesc}>{proj.description}</Text>
                {proj.technologies && proj.technologies.length > 0 ? (
                  <View style={styles.techBadgeContainer}>
                    <Text style={styles.techBadge}>Tech: {proj.technologies.map((t: any) => t.name).join(', ')}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* SKILLS */}
        {cvData?.skills && cvData.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compétences Techniques</Text>
            <View style={styles.skillsContainer}>
              {cvData.skills.map((skillGroup: any, idx: number) => (
                <View key={idx} style={styles.skillRow}>
                  <Text style={styles.skillCategory}>{skillGroup.category}</Text>
                  <Text style={styles.skillItems}>{skillGroup.items.join(', ')}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* LANGUAGES */}
        {cvData?.languages && cvData.languages.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Langues</Text>
            <View style={styles.skillsContainer}>
              {cvData.languages.map((lang: any, idx: number) => (
                <View key={idx} style={styles.skillRow}>
                  <Text style={styles.skillCategory}>{lang.name}</Text>
                  <Text style={styles.skillItems}>{lang.level}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* CUSTOM SECTIONS */}
        {cvData?.custom_sections && cvData.custom_sections.length > 0 ? (
          <View style={styles.section}>
            {cvData.custom_sections.map((section: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.summary}>{section.content}</Text>
              </View>
            ))}
          </View>
        ) : null}

      </Page>
    </Document>
  );
}
