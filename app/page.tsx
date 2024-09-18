"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/toaster";

const MAX_FILE_SIZE = 100000000; // 100MB
const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
];

const formSchema = z.object({
  file: z.any().refine((file) => {
    if (!file) return false;
    if (file.size > MAX_FILE_SIZE) return false;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return false;
    return true;
  }, "File is required and must be a valid image under 100MB"),
});

export default function Home() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploadProgress(0);
    setDownloadLink("");

    const formData = new FormData();
    formData.append("file", values.file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setDownloadLink(data.downloadUrl);
      setUploadProgress(100);

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    }
  }

  const copyToClipboard = () => {
    const fullUrl = window.location.origin + downloadLink;
    navigator.clipboard.writeText(fullUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "The download link has been copied to your clipboard.",
        variant: "default",
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast({
        title: "Copy failed",
        description: "There was an error copying the link. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <main className="flex justify-center items-center min-h-screen flex-col space-y-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>Upload your file here for FREE!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Upload Image
              </Button>
            </form>
          </Form>
          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="mt-4" />
          )}
          {downloadLink && (
            <div className="mt-4">
              <p>File uploaded successfully!</p>
              <div className="flex items-center mt-2">
                <a href={downloadLink} className="text-blue-500 hover:underline mr-2" target="_blank" rel="noopener noreferrer">
                  Download Link
                </a>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}