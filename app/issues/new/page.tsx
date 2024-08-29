'use client';

import { Button, Callout, TextField } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/createIssueSchema';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type IssueForm = z.infer<typeof createIssueSchema>;


const NewIssuePage = () => {

  const router = useRouter();
  const {register, control, handleSubmit, formState: { errors}} = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema)
  }); 
  const [error, setError] = useState('');
  const [isSubitting, setSubmiting] = useState(false);

  return (
    <div className='max-w-xl'>
      { error && <Callout.Root color='red' className='mb-5'>
        <Callout.Text>{error}</Callout.Text>
        </Callout.Root>}
      <form className='max-w-xl space-y-3' onSubmit={handleSubmit( async (data)=>{ 

          try {
            setSubmiting(true);
            await axios.post("/api/issues", data)
            router.push('/issues');

          } catch (error) {
            setError('An unexpected error ocurred.')
            setSubmiting(false)
            
          }
        })}>
        <TextField.Root placeholder='Title' {...register('title')} />

        <ErrorMessage> {errors.title?.message} </ErrorMessage>

        <Controller
          name='description'
          control={control}
          render={({field})=> <SimpleMDE placeholder='Description' {...field} /> }
          />
        <ErrorMessage >{errors.description?.message} </ErrorMessage>
        <Button disabled={isSubitting}>Submit New Issue {isSubitting && <Spinner />}</Button>
      </form>

    </div>
  )
}

export default NewIssuePage