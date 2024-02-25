import { Alert, AlertTitle, AlertDescription } from '@/components/Alert';
import { Button } from '@/components/Button';
import Footer from '@/components/Footer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/Form';
import Header from '@/components/Header';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/TextArea';
import { useToast } from '@/hooks/use-toast';
import useClaimBrewery from '@/hooks/useClaimBrewery';
import { NextPageWithLayout } from '@/pages/_app';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'El campo nombre es requerido',
    })
    .max(150),
  email: z.string().email({
    message: 'El campo email es requerido',
  }),
  title: z
    .string()
    .min(1, {
      message: 'El campo cargo es requerido',
    })
    .max(150),
  message: z.string().max(500, {
    message: 'Este campo no debe exceder el maximo de 500 caracteres',
  }),
});

const ClaimBreweryForm: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { toast } = useToast();
  const { trigger } = useClaimBrewery(query.breweryId as string);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: '',
      email: '',
      title: '',
      message: '',
    },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = form;

  const onSubmit = handleSubmit(async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    await trigger(values);
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast({
        title: 'Envio exitoso',
        description:
          'Pronto nos pondremos en contacto para validar la informacion.',
      });
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <article>
      <Alert variant="warning" className="bg-yellow-50 mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Precaucion</AlertTitle>
        <AlertDescription>
          Nos pondremos en contacto con tigo para validar tu asosiacion a esta
          cerveceria. Hacemos el proceso de revision de cada cerveceria
          manualmente por lo que la aprobacion puede tardar un tiempo.
        </AlertDescription>
      </Alert>
      <div>
        <h2 className="font-bold text-4xl mb-6">Reclamar cerveceria</h2>
        <Form {...form}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tu nombre"></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="correo@cerveceria.com"
                    ></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cargo <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Tu cargo en la cerveceria"
                    ></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Cuentanos sobre tu vinculacion con la cerveceria"
                    ></Textarea>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <Button type="submit">
              {isSubmitting ? 'Enviando' : 'Reclamar'}
            </Button>
          </form>
        </Form>
      </div>
    </article>
  );
};

ClaimBreweryForm.getLayout = (page) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header></Header>
      <main>
        <div className="mx-auto max-w-screen-md py-12">{page}</div>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default ClaimBreweryForm;
