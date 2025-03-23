import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import type { Experience } from '@/lib/types';

export default function AdminExperiences() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);

  // Fetch all experiences
  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['/api/experiences'],
  });

  // Upload main image mutation
  const uploadMainImageMutation = useMutation({
    mutationFn: async ({ experienceId, formData }: { experienceId: number; formData: FormData }) => {
      return apiRequest(`/api/upload/experience/${experienceId}`, {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Main image uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      setMainImage(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to upload image: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Upload gallery images mutation
  const uploadGalleryImagesMutation = useMutation({
    mutationFn: async ({ experienceId, formData }: { experienceId: number; formData: FormData }) => {
      return apiRequest(`/api/upload/experience/${experienceId}/gallery`, {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Gallery images uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      setGalleryImages(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to upload gallery images: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleMainImageUpload = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedExperience || !mainImage) return;

    const formData = new FormData();
    formData.append('image', mainImage);

    uploadMainImageMutation.mutate({
      experienceId: selectedExperience.id,
      formData,
    });
  };

  const handleGalleryImagesUpload = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedExperience || !galleryImages || galleryImages.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < galleryImages.length; i++) {
      formData.append('images', galleryImages[i]);
    }

    uploadGalleryImagesMutation.mutate({
      experienceId: selectedExperience.id,
      formData,
    });
  };

  return (
    <div className="container py-10">
      <Helmet>
        <title>Admin - Manage Experiences | Immersify</title>
      </Helmet>

      <h1 className="text-4xl font-bold mb-6">Manage Experiences</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Experiences</CardTitle>
              <CardDescription>Select an experience to manage its images</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading experiences...</p>
              ) : (
                <div className="space-y-2">
                  {experiences.map((experience: Experience) => (
                    <Button
                      key={experience.id}
                      variant={selectedExperience?.id === experience.id ? 'default' : 'outline'}
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedExperience(experience)}
                    >
                      {experience.name}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedExperience && (
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedExperience.name}</CardTitle>
                <CardDescription>Update main image</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="border rounded-md overflow-hidden w-32 h-32">
                        <img
                          src={selectedExperience.imageUrl}
                          alt={selectedExperience.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="mainImage">Main Image</Label>
                        <Input
                          id="mainImage"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => setMainImage(e.target.files ? e.target.files[0] : null)}
                        />
                        <Button
                          onClick={handleMainImageUpload}
                          disabled={!mainImage || uploadMainImageMutation.isPending}
                          className="w-full"
                        >
                          {uploadMainImageMutation.isPending ? 'Uploading...' : 'Upload Main Image'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gallery Images</CardTitle>
                <CardDescription>Add additional images (up to 5 at once)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    {selectedExperience.galleryImages && selectedExperience.galleryImages.length > 0 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {selectedExperience.galleryImages.map((img, index) => (
                          <div key={index} className="border rounded-md overflow-hidden w-24 h-24 flex-shrink-0">
                            <img
                              src={img}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="galleryImages">Gallery Images (Max 5)</Label>
                      <Input
                        id="galleryImages"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        max={5}
                        onChange={(e) => setGalleryImages(e.target.files)}
                      />
                      <Button
                        onClick={handleGalleryImagesUpload}
                        disabled={!galleryImages || galleryImages.length === 0 || uploadGalleryImagesMutation.isPending}
                        className="w-full"
                      >
                        {uploadGalleryImagesMutation.isPending
                          ? 'Uploading...'
                          : `Upload ${galleryImages?.length || 0} Gallery Images`}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}