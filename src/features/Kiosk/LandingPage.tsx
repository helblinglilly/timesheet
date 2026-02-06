'use client'

import Link from 'next/link';
import React from 'react'
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';

export const KioskLandingPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xl font-bold text-black">{ t('kiosk_mode.name') }</span>
            </div>
            <Link
              href="/auth/login"
            >
              <Button variant="default">
                {t('kiosk_mode.sign_in')}
              </Button>
            </Link>
          </nav>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              <Trans i18nKey="kiosk_mode.tagline" />
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              <Trans i18nKey="kiosk_mode.usp.summary" />
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/signup"
                className='h-full'
              >
                <Button className='h-12 px-8 text-lg'>
                  {t('kiosk_mode.get_started')}
                </Button>
              </Link>

              <a
                href="#features"
              >
                <Button variant="outline" className='h-12 px-8 text-black text-lg border-gray-300 hover:bg-gray-50'>
                  {t('kiosk_mode.jump_to_features')}
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">{ t('kiosk_mode.usp.title')}</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Self-Hosted */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{t('kiosk_mode.usp.self_host.title')}</h3>
              <p className="text-gray-600">
                {t('kiosk_mode.usp.self_host.content')}
              </p>
            </div>

            {/* Social Auth */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{ t('kiosk_mode.usp.social_auth.title') }</h3>
              <p className="text-gray-600">
                Sign in with your favorite providers—Google, GitHub, Microsoft, and more.
                No need to remember another password.
              </p>
            </div>

            {/* Shared Sheets */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{t('kiosk_mode.usp.shared_sheets.title')}</h3>
              <p className="text-gray-600">
                {t('kiosk_mode.usp.shared_sheets.content')}
              </p>
            </div>
          </div>
        </div>

        {/* Self-Hosting Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-black">{ t('kiosk_mode.self_hosting.title') }</h2>
            <p className="text-gray-700 text-center mb-8 max-w-2xl mx-auto">
              {t('kiosk_mode.self_hosting.subheading')}
            </p>

            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-400 font-mono">{ t('kiosk_mode.self_hosting.docker_compose') }</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-gray-300">{`version: '3.8'
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
    image: ghcr.io/helblinglilly/pocketbase:0.36.1
    container_name: pb_timesheet
    restart: unless-stopped
    networks:
      - timesheet_network
    volumes:
      - /var/timesheet:/pb/pb_data
    # Only required during initial setup
    ports:
      - "8080:8080"

networks:
  timesheet_network:
    name: timesheet_network
  driver: bridge`}</code>
              </pre>
            </div>

            <p className="text-gray-600 text-sm text-center mt-4">
              <Trans
                i18nKey="kiosk_mode.self_hosting.disclaimer"
                components={{
                  a: <Link href="https://github.com/helblinglilly/timesheet?tab=readme-ov-file#self-hosting" className="text-blue-500 hover:text-blue-600 underline" />
                }}
              />
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-white">{t('kiosk_mode.call_to_action.title')}</h2>
            <p className="text-gray-300 mb-8">
              {t('kiosk_mode.call_to_action.subheading')}
            </p>
            <Link
              href="/auth/signup"
            >
              <Button className='font-semibold h-12 px-8 bg-white text-black hover:bg-gray-100'>
                {t('kiosk_mode.call_to_action.button')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-16 bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-black">{ t('kiosk_mode.name') }</span>
              </div>
              <p className="text-gray-700 text-sm">
                <Trans
                  i18nKey="kiosk_mode.footer"
                  components={{
                    a: <a href="https://github.com/helblinglilly/timesheet" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline" />
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
