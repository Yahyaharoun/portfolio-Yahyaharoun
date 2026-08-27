import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { Experience, Project } from '@/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 5,
    color: '#111827',
  },
  title: {
    fontSize: 14,
    color: '#6d5dfc',
    fontWeight: 600,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contact: {
    fontSize: 10,
    color: '#666666',
    flexDirection: 'row',
    gap: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 5,
  },
  item: {
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#111827',
  },
  itemDate: {
    fontSize: 10,
    color: '#888888',
  },
  itemSub: {
    fontSize: 11,
    color: '#6d5dfc',
    fontWeight: 600,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.5,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 5,
  },
  badge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 8,
    color: '#374151',
  },
  about: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.6,
    marginBottom: 20,
  }
});

interface CVProps {
  experiences: Experience[];
  projects: Project[];
}

export const CVDocument = ({ experiences = [], projects = [] }: CVProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>Yahya Haroun</Text>
          <Text style={styles.title}>Développeur Progressive Web Apps & SaaS</Text>
          <View style={styles.contact}>
            <Text>contact@yahyaharoun.com</Text>
            <Text>+237 000 000 000</Text>
            <Text>linkedin.com/in/yahya-haroun-87a446344</Text>
            <Text>github.com/yahyaharoun</Text>
          </View>
        </View>

        <Text style={styles.about}>
          Étudiant en informatique, entrepreneur et développeur de Progressive Web Apps, je conçois des solutions numériques modernes, sécurisées et adaptées aux réalités africaines. Mon objectif est de créer des produits utiles qui allient innovation, simplicité et performance. Fort de mon expérience terrain en gestion, je développe des outils pragmatiques (Offline-First).
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expériences Professionnelles</Text>
          {experiences.length > 0 ? experiences.map((exp) => (
            <View key={exp.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.title}</Text>
                <Text style={styles.itemDate}>
                  {formatDate(exp.start_date)} - {exp.is_current ? 'Présent' : (exp.end_date ? formatDate(exp.end_date) : '')}
                </Text>
              </View>
              {exp.organization && <Text style={styles.itemSub}>{exp.organization}</Text>}
              {exp.description && <Text style={styles.itemDesc}>{exp.description}</Text>}
            </View>
          )) : (
            <Text style={styles.itemDesc}>Données d'expériences en cours de mise à jour.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projets Majeurs</Text>
          {projects.length > 0 ? projects.map((proj) => (
            <View key={proj.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{proj.title}</Text>
              </View>
              <Text style={styles.itemDesc}>{proj.description}</Text>
              {proj.type && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badge}>{proj.type}</Text>
                </View>
              )}
            </View>
          )) : (
            <Text style={styles.itemDesc}>Données de projets en cours de mise à jour.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compétences Techniques</Text>
          <View style={styles.badgeContainer}>
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Progressive Web Apps', 'Offline-First', 'IndexedDB', 'DevSecOps', 'Node.js', 'PostgreSQL'].map(skill => (
              <Text key={skill} style={styles.badge}>{skill}</Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
