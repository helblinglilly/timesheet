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
import { usePathname } from 'next/navigation'

export function Navbar() {
  const isMobile = useIsMobile()
  const pathname = usePathname();
  const { t } = useTranslation();


  return (
    <NavigationMenu viewport={isMobile} className='w-full max-w-full justify-between p-2'>
      <NavigationMenuList >
        <NavigationMenuItem className='text-md'>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/dashboard" >{ t('navbar.dashboard.title')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className='text-md'>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/account" >{ t('navbar.account.title')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

      </NavigationMenuList>

      <NavigationMenuList>
        <NavigationMenuItem className='pl-auto' hidden={['/auth/login', '/auth/signup'].includes(pathname)}>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="/auth/logout">{t('navbar.logout.title')}</a>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className='pl-auto' hidden={pathname !== '/auth/signup'}>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="/auth/login">{t('navbar.login.title')}</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
