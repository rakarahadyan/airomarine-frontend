'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { POI, POICategory } from '@/types/poi';

const poiSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  categoryId: z.string().min(1, 'Category is required'),
  icon: z.string().optional(),
  color: z.string().optional(),
});

type POIFormData = z.infer<typeof poiSchema>;

interface POIFormProps {
  poi?: POI;
  categories: POICategory[];
  onSubmit: (data: POIFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function POIForm({ poi, categories, onSubmit, onCancel, isLoading }: POIFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<POIFormData>({
    resolver: zodResolver(poiSchema),
    defaultValues: poi
      ?  {
          name: poi.name,
          description: poi.description,
          latitude: poi.latitude,
          longitude: poi.longitude,
          categoryId: poi.category.id,
          icon: poi.icon,
          color: poi.color,
        }
      : {
          color: '#3388ff',
        },
  });

  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Enter POI name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Enter description (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Latitude"
          type="number"
          step="any"
          {...register('latitude', { valueAsNumber: true })}
          error={errors.latitude?.message}
          placeholder="-90 to 90"
        />
        <Input
          label="Longitude"
          type="number"
          step="any"
          {...register('longitude', { valueAsNumber: true })}
          error={errors.longitude?.message}
          placeholder="-180 to 180"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          {...register('categoryId')}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Icon (Emoji)
          </label>
          <Input {...register('icon')} placeholder="📍" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              {...register('color')}
              className="h-10 w-14 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <Input
              {...register('color')}
              placeholder="#3388ff"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview</p>
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: selectedColor + '20' }}
          >
            <span className="text-xl">{watch('icon') || '📍'}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {watch('name') || 'POI Name'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {watch('description') || 'Description'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {poi ?  'Update POI' : 'Create POI'}
        </Button>
      </div>
    </form>
  );
}