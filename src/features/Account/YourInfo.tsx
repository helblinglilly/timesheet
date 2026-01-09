'use client'

import { format } from 'date-fns';
import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { api } from '~/trpc/react';

export const YourInfo = () => {
  const [user] = api.account.getFullUserDetails.useSuspenseQuery();

  const { t } = useTranslation();
  const apiUtils = api.useUtils();
  const nameCloseButtonRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const { mutate: changeName } = api.account.updateName.useMutation({
    onSuccess: async () => {
      if (!nameCloseButtonRef.current){
        return;
      }

      nameCloseButtonRef.current.click();
      await apiUtils.account.getFullUserDetails.invalidate();
    }
  });


  if (!user) {
    // eslint-disable-next-line no-console
    console.error('Rendering null', new Error('"user" was nullish in client component when server-side checks succeeded'))
    return null;
  }

  return (
    <>
      <section className=''>
        <Card className='md:max-w-128'>
          <CardHeader>
            <CardTitle>
              {t('account.your_info.section_header')}
            </CardTitle>
          </CardHeader>

          <CardContent className='grid gap-4 md:gap-8 justify-items-stretch w-full md:grid-cols-[auto_1fr] md:items-center'>

            <Image
              unoptimized
              className='bg-slate-800 rounded-lg justify-self-center md:justify-self-start'
              src={`https://avatar.helbling.uk/${user.id}`}
              height={100}
              alt={t('account.your_info.avatar_alt')}
              width={100}
            />

            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="hover:cursor-pointer w-full flex justify-between md:justify-start md:gap-4">
                    <Label className="hover:cursor-pointer min-w-18" aria-label={t('account.your_info.name.change_name.open_dialog_aria', { name: user.name })}>
                      {t('account.your_info.name.label')}
                    </Label>
                    <span className='inline-flex gap-2'>
                      <p id="name">{user.name}</p>
                      <FilePenLine className='p-1' />
                    </span>
                  </div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{ t('account.your_info.name.change_name.title') }</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    {t('account.your_info.name.change_name.description')}
                  </DialogDescription>
                  <form className="grid gap-4 pt-2" onSubmit={(e) => {
                    e.preventDefault();

                    if (!nameRef.current) {
                      return;
                    }

                    changeName({
                      userId: user.id,
                      name: nameRef.current.value,
                    })
                  }}>
                    <Input ref={nameRef} id="name" name="name" type="text" defaultValue={user.name} />
                    <Button type="submit">{ t('account.your_info.name.change_name.submit_cta') }</Button>
                  </form>
                </DialogContent>
                <DialogClose asChild>
                  <Button hidden ref={nameCloseButtonRef} />
                </DialogClose>
              </Dialog>

              <div className="w-full flex justify-between md:justify-start md:gap-4">
                <Label className='min-w-18'>
                  {t('account.your_info.email.label')}
                </Label>

                <Tooltip>
                  <TooltipTrigger className=''>
                    <p id="email">{user.email}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{ t('account.your_info.email.no_change') }</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="w-full flex justify-between md:justify-start md:gap-4">
                <Label className='min-w-12'>
                  {t('account.your_info.created_at.label')}
                </Label>
                <p id="email">{user.memberSince ? format(new Date(user.memberSince), 'LLL yyyy') : '-'}</p>
              </div>
            </div>
          </CardContent>

        </Card>
      </section>
    </>
  );
}
