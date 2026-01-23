'use client'

import Link from 'next/link';
import React from 'react'
import { Trans, useTranslation } from 'react-i18next';

export const KioskLandingPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xl font-bold">{ t('kiosk_mode.name') }</span>
            </div>
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {t('kiosk_mode.sign_in')}
            </Link>
          </nav>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              <Trans i18nKey="kiosk_mode.tagline" />
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              <Trans i18nKey="kiosk_mode.usp.summary" />
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                {t('kiosk_mode.get_started')}
              </Link>
              <a
                href="#features"
                className="border border-slate-600 hover:border-slate-500 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                {t('kiosk_mode.jump_to_features')}
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-8">{ t('kiosk_mode.usp.title')}</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Self-Hosted */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('kiosk_mode.usp.self_host.title')}</h3>
              <p className="text-slate-400">
                {t('kiosk_mode.usp.self_host.content')}
              </p>
            </div>

            {/* Social Auth */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{ t('kiosk_mode.usp.social_auth.title') }</h3>
              <p className="text-slate-400">
                Sign in with your favorite providers—Google, GitHub, Microsoft, and more.
                No need to remember another password.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('kiosk_mode.usp.shared_sheets.title')}</h3>
              <p className="text-slate-400">
                {t('kiosk_mode.usp.shared_sheets.content')}
              </p>
            </div>
          </div>
        </div>

        {/* Self-Hosting Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">{ t('kiosk_mode.self_hosting.title') }</h2>
            <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
              {t('kiosk_mode.self_hosting.subheading')}
            </p>

            <div className="bg-slate-950 rounded-xl border border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-slate-400 font-mono">{ t('kiosk_mode.self_hosting.docker_compose') }</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-slate-300">{`version: '3.8'
services:
  timesheet:
    ports:
      - "1234:3000"
    image: ghcr.io/helblinglilly/timesheet:main
    container_name: timesheet
    networks:
      - timesheet_network
    hostname: timesheet.helbling.uk
    pull_policy: always
    restart: unless-stopped
    environment:
      - POCKETBASE_SUPERUSER_EMAIL=admin@example.com
      - POCKETBASE_SUPERUSER_PASSWORD=supersecurepassword
      - NEXT_PUBLIC_HOST=https://timesheet.example.com
      # Optional, but required to send Emails
      - SMTP_HOST=smtp.example.com
      - SMTP_PORT=465
      - SMTP_USER=me@example.com
      - SMTP_PASSWORD=mysupersecurepassword
      - EMAIL_SENDER=admin@timesheet.example.com
      # Do not need to be modified
      - POCKETBASE_URL=http://pb_timesheet:8080
      - NODE_ENV=production

  pb_timesheet:
    image: pocketbase:0.29.0
    container_name: pb_timesheet
    restart: unless-stopped
    networks:
      - timesheet_network
    volumes:
      - /var/timesheet:/pb/pb_data
    # Only required during initial setup
    ports:
      - "8081:8080"

networks:
  timesheet_network:
    name: timesheet_network
  driver: bridge`}</code>
              </pre>
            </div>

            <p className="text-slate-500 text-sm text-center mt-4">
              <Trans
                i18nKey="kiosk_mode.self_hosting.disclaimer"
                components={{
                  a: <Link href="/docs/get-started" className="text-blue-400 hover:text-blue-300 underline" />
                }}
              />
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">{t('kiosk_mode.call_to_action.title')}</h2>
            <p className="text-slate-300 mb-8">
              {t('kiosk_mode.call_to_action.subheading')}
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{ t('kiosk_mode.name') }</span>
              </div>
              <p className="text-slate-500 text-sm">
                <Trans
                  i18nKey="kiosk_mode.footer"
                  components={{
                    a: <a href="https://github.com/helblinglilly/timesheet" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline" />
                  }}
                />
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
