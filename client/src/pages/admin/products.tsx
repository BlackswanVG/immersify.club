import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import { insertProductSchema } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Product } from '@/lib/types';

// Create a form schema based on the insert schema
const productFormSchema = insertProductSchema.extend({
  // Add any custom form validation here
}).pick({
  name: true,
  slug: true,
  description: true,
  price: true,
  category: true,
  inventory: true,
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);

  // Fetch all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  // Create form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      category: 'Apparel',
      inventory: 0,
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      return apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          imageUrl: '/placeholder-product.jpg', // Default placeholder until image is uploaded
        }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setSelectedProduct(data);
      setIsCreating(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create product: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ProductFormValues> }) => {
      return apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update product: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Upload product image mutation
  const uploadProductImageMutation = useMutation({
    mutationFn: async ({ productId, formData }: { productId: number; formData: FormData }) => {
      return apiRequest(`/api/upload/product/${productId}`, {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Product image uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setProductImage(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to upload image: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleProductImageUpload = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProduct || !productImage) return;

    const formData = new FormData();
    formData.append('image', productImage);

    uploadProductImageMutation.mutate({
      productId: selectedProduct.id,
      formData,
    });
  };

  const onSubmit = (data: ProductFormValues) => {
    if (isCreating) {
      createProductMutation.mutate(data);
    } else if (selectedProduct) {
      updateProductMutation.mutate({
        id: selectedProduct.id,
        data,
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsCreating(false);
    form.reset({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.category,
      inventory: product.inventory || 0,
    });
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setIsCreating(true);
    form.reset({
      name: '',
      slug: '',
      description: '',
      price: 0,
      category: 'Apparel',
      inventory: 0,
    });
  };

  return (
    <div className="container py-10">
      <Helmet>
        <title>Admin - Manage Merchandise | Immersify</title>
      </Helmet>

      <h1 className="text-4xl font-bold mb-6">Manage Merchandise</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Select a product to manage or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button 
                  onClick={handleNewProduct} 
                  className="w-full"
                  variant="outline"
                >
                  + Create New Product
                </Button>
              </div>
              {isLoading ? (
                <p>Loading products...</p>
              ) : (
                <div className="space-y-2">
                  {products.map((product: Product) => (
                    <Button
                      key={product.id}
                      variant={selectedProduct?.id === product.id ? 'default' : 'outline'}
                      className="w-full justify-start text-left"
                      onClick={() => handleEditProduct(product)}
                    >
                      {product.name}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{isCreating ? 'Create New Product' : selectedProduct ? `Edit: ${selectedProduct.name}` : 'Select or create a product'}</CardTitle>
              <CardDescription>
                {isCreating 
                  ? 'Fill in the details to create a new product' 
                  : selectedProduct 
                    ? 'Update product information' 
                    : 'Select a product from the list or create a new one'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(isCreating || selectedProduct) && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="T-Shirt" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="t-shirt" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL-friendly identifier (e.g., "t-shirt")
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Product description..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                min="0"
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inventory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inventory</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min="0"
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Apparel">Apparel</SelectItem>
                              <SelectItem value="Art">Art</SelectItem>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                              <SelectItem value="Collectibles">Collectibles</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createProductMutation.isPending || updateProductMutation.isPending}
                    >
                      {createProductMutation.isPending || updateProductMutation.isPending
                        ? 'Saving...'
                        : isCreating 
                          ? 'Create Product'
                          : 'Update Product'
                      }
                    </Button>
                  </form>
                </Form>
              )}

              {selectedProduct && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Product Image</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-md overflow-hidden w-full h-48">
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="productImage">Update Image</Label>
                        <Input
                          id="productImage"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => setProductImage(e.target.files ? e.target.files[0] : null)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="mt-2">
                        <Button
                          type="button"
                          onClick={handleProductImageUpload}
                          disabled={!productImage || uploadProductImageMutation.isPending}
                          className="w-full"
                        >
                          {uploadProductImageMutation.isPending ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}