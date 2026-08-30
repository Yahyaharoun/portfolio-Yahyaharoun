import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Font } from '@react-pdf/renderer';

const ACCENT_COLOR = '#000000'; // Sleek black for standard CVs
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#4B5563';
const BORDER_COLOR = '#E5E7EB';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: `2px solid ${ACCENT_COLOR}`,
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_DARK,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  contactRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 9,
    color: TEXT_MUTED,
  },
  contactItem: {
    textDecoration: 'none',
    color: TEXT_MUTED,
  },
  contactSeparator: {
    marginHorizontal: 4,
    color: BORDER_COLOR,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
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
    fontSize: 11,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  itemDate: {
    fontSize: 9,
    color: TEXT_MUTED,
  },
  itemSubtitle: {
    fontSize: 10,
    color: TEXT_DARK,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 10,
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
    fontSize: 10,
    fontWeight: 'bold',
    color: TEXT_DARK,
    width: 100,
  },
  skillItems: {
    fontSize: 10,
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
    fontSize: 9,
    color: TEXT_DARK,
    marginRight: 6,
    fontStyle: 'italic',
  }
});

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

  return (
    <Document title={`CV_${profile?.full_name?.replace(/\s+/g, '_') || 'Yahya_Haroun'}`}>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{cvData?.full_name || profile?.full_name || 'Yahya Haroun'}</Text>
          <Text style={styles.title}>{cvData?.professional_title || profile?.title || 'Développeur Full Stack'}</Text>
          
          <View style={styles.contactRow}>
            {profile?.email && <Link src={`mailto:${profile.email}`} style={styles.contactItem}>{profile.email}</Link>}
            {profile?.phone && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text style={styles.contactItem}>{profile.phone}</Text>
              </>
            )}
            {profile?.linkedin_url && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Link src={profile.linkedin_url} style={styles.contactItem}>LinkedIn</Link>
              </>
            )}
            {profile?.github_url && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Link src={profile.github_url} style={styles.contactItem}>GitHub</Link>
              </>
            )}
            {profile?.portfolio_url && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Link src={profile.portfolio_url} style={styles.contactItem}>Portfolio</Link>
              </>
            )}
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
