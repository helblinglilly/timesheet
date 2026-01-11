'use client'

import { Trans, useTranslation } from 'react-i18next'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export function Email() {
  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <form onSubmit={(e) => {
          e.preventDefault();

        }}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{ t('authentication.login.email.fields.email.label') }</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('authentication.login.email.fields.email.placeholder')}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t('authentication.login.email.fields.password.label')}</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {t('authentication.login.email.forgot_password')}
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          {t('authentication.login.email.fields.login_cta')}
        </Button>
        <div className="inline-flex gap-1 text-muted-foreground text-sm">
          <Trans
            i18nKey="authentication.login.email.signup"
            components={{
              a: <a href="/auth/signup" className="underline"></a>
            }}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
