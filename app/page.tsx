'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SiteSettings, ServiceCategory, PublicProduct, PublicProject } from '../types/api';
import {
  getSiteSettings,
  getCategories,
  getFeaturedProducts,
  getFeaturedProjects,
} from '../lib/api-client';
import { verifiedSiteSettings, verifiedCategories } from '../lib/public-data';

import { SiteHeader } from '../components/SiteHeader';
import { HeroSection } from '../components/HeroSection';
import { ServiceCategoryCards } from '../components/ServiceCategoryCards';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { ProjectGalleryPreview } from '../components/ProjectGalleryPreview';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { ServiceAreaNotice } from '../components/ServiceAreaNotice';
import { ContactStrip } from '../components/ContactStrip';
import { SiteFooter } from '../components/SiteFooter';
import { MobileContactAction } from '../components/MobileContactAction';

export default function HomePage() {
  // 1. Component State
  const [settings, setSettings] = useState<SiteSettings>(verifiedSiteSettings);
  const [categories, setCategories] = useState<ServiceCategory[]>(verifiedCategories);

  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<boolean>(false);

  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [projectsError, setProjectsError] = useState<boolean>(false);

  // 2. Fetch Featured Products with dedicated error isolation
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(false);
    try {
      const res = await getFeaturedProducts(6);
      setProducts(res.data);
    } catch {
      setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // 3. Fetch Featured Projects with dedicated error isolation
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError(false);
    try {
      const res = await getFeaturedProjects(6);
      setProjects(res.data);
    } catch {
      setProjectsError(true);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  // 4. Initial Mount Load
  useEffect(() => {
    async function initSettingsAndCategories() {
      try {
        const [settingsRes, categoriesRes] = await Promise.allSettled([
          getSiteSettings(),
          getCategories(),
        ]);

        if (settingsRes.status === 'fulfilled') {
          setSettings(settingsRes.value.data);
        }
        if (categoriesRes.status === 'fulfilled') {
          setCategories(categoriesRes.value.data);
        }
      } catch (err) {
        console.warn('Initialization notice:', err);
      }
    }

    initSettingsAndCategories();
    fetchProducts();
    fetchProjects();
  }, [fetchProducts, fetchProjects]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#201A15] relative pb-20 sm:pb-0">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#1E4D2B] text-white rounded-lg shadow-md font-semibold text-sm focus-accessible"
      >
        Skip to main content
      </a>

      {/* 1. Header with Navigation, Logo, Search, Account & Optional Announcement */}
      <SiteHeader settings={settings} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* 2. Hero Section with Value Proposition, Photography & Primary/Secondary CTAs */}
        <HeroSection hero={settings.hero} />

        {/* 3. Service Category Cards Grid */}
        <ServiceCategoryCards categories={categories} />

        {/* 4. Featured Active Products Grid with Pricing Rules & States */}
        <FeaturedProducts
          products={products}
          isLoading={productsLoading}
          isError={productsError}
          onRetry={fetchProducts}
        />

        {/* 5. Approved Real Project Gallery Preview */}
        <ProjectGalleryPreview
          projects={projects}
          isLoading={projectsLoading}
          isError={projectsError}
          onRetry={fetchProjects}
        />

        {/* 6. How Carpentry Works (5-Stage Milestone Flow) */}
        <HowItWorksSection />

        {/* 7. Local Service Area Notice (Honest Geographic Feasibility) */}
        <ServiceAreaNotice summary={settings.serviceAreaSummary} />

        {/* 8. Verified Direct Workshop Contact Strip */}
        <ContactStrip contact={settings.contact} />
      </main>

      {/* 9. Structured Footer with Legal, Navigation & Workshop Coordinates */}
      <SiteFooter settings={settings} />

      {/* 10. Non-Obstructive Mobile Floating Contact Action */}
      <MobileContactAction contact={settings.contact} />
    </div>
  );
}
