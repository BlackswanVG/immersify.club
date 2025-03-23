import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Experience } from '@/lib/types';

// Create a form schema for experience editing
const experienceFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().min(1, "Price must be at least $1"),
  duration: z.coerce.number().min(5, "Duration must be at least 5 minutes"),
  minAge: z.coerce.number().min(0, "Minimum age must be 0 or greater"),
  maxAge: z.coerce.number().min(0, "Maximum age must be 0 or greater"),
  requirements: z.string().optional(),
  specialEquipment: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export default function AdminExperiences() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all experiences
  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['/api/experiences'],
  });
  
  // Form for editing experience details
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      description: '',
      price: 0,
      duration: 0,
      minAge: 0,
      maxAge: 0,
      requirements: '',
      specialEquipment: '',
    },
  });
  
  // Update experience details mutation
  const updateExperienceMutation = useMutation({
    mutationFn: async (data: ExperienceFormValues & { id: number }) => {
      const { id, ...updateData } = data;
      return apiRequest(`/api/experiences/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Experience details updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update experience details: ${error.message}`,
        variant: 'destructive',
      });
    },
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

  // Handle editing experience
  const handleEditExperience = () => {
    if (!selectedExperience) return;
    
    // Reset the form with the selected experience values
    form.reset({
      name: selectedExperience.name,
      shortDescription: selectedExperience.shortDescription,
      description: selectedExperience.description,
      price: selectedExperience.price,
      duration: selectedExperience.duration,
      minAge: selectedExperience.minAge || 0,
      maxAge: selectedExperience.maxAge || 0,
      requirements: selectedExperience.requirements || '',
      specialEquipment: selectedExperience.specialEquipment || '',
    });
    
    setIsEditing(true);
  };
  
  // Handle form submission
  const onSubmit = (data: ExperienceFormValues) => {
    if (!selectedExperience) return;
    
    updateExperienceMutation.mutate({
      id: selectedExperience.id,
      ...data,
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedExperience.name}</CardTitle>
                  <CardDescription>Update experience details and images</CardDescription>
                </div>
                <Button onClick={handleEditExperience} disabled={isEditing}>
                  Edit Details
                </Button>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                              <Textarea rows={4} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (minutes)</FormLabel>
                              <FormControl>
                                <Input type="number" min="5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="minAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Age</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="maxAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Age</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="requirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requirements</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="specialEquipment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Equipment</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          disabled={updateExperienceMutation.isPending}
                        >
                          {updateExperienceMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
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
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold">Price</h3>
                          <p className="text-gray-600">${selectedExperience.price}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Duration</h3>
                          <p className="text-gray-600">{selectedExperience.duration} minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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