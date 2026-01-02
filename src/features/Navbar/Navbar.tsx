'use client'

import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'
import { useIsMobile } from '~/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const isMobile = useIsMobile()
  const { t } = useTranslation();

  return (
    <NavigationMenu viewport={isMobile} className='w-full max-w-full justify-between p-2'>
      <NavigationMenuList >
        <NavigationMenuItem className='text-md'>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/dashboard" >{ t('navbar.dashboard.title')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/*<NavigationMenuItem className='hidden'>
          <NavigationMenuTrigger className='text-md'>{ t('navbar.timesheets.title') }</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/timesheet/new">{t('navbar.timesheets.new')}</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>*/}

        <NavigationMenuItem className='text-md'>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/account" >{ t('navbar.account.title')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

      </NavigationMenuList>

      <NavigationMenuList>
        <NavigationMenuItem className='pl-auto'>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/auth/logout">{t('navbar.logout.title')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
