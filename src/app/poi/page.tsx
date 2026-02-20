'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { POIList } from '@/components/poi/POIList';
import { POIForm } from '@/components/poi/POIForm';
import { MapContainer } from '@/components/map/MapContainer';
import { usePOIs, usePOICategories, useCreatePOI, useUpdatePOI, useDeletePOI } from '@/hooks/usePOI';
import { POI } from '@/types/poi';
import { PlusIcon, MapIcon, ListBulletIcon } from '@heroicons/react/24/solid';

type ViewMode = 'split' | 'map' | 'list';

export default function POIPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPOI, setEditingPOI] = useState<POI | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  const { data: pois = [], isLoading } = usePOIs();
  const { data: categories = [] } = usePOICategories();
  const createPOI = useCreatePOI();
  const updatePOI = useUpdatePOI();
  const deletePOI = useDeletePOI();

  const handleAddPOI = () => {
    setEditingPOI(null);
    setShowFormModal(true);
  };

  const handleEditPOI = (poi: POI) => {
    setEditingPOI(poi);
    setShowFormModal(true);
  };

  const handleDeletePOI = (poi: POI) => {
    if (confirm(`Are you sure you want to delete "${poi.name}"? `)) {
      deletePOI.mutate(poi.id);
    }
  };

  const handleToggleVisibility = (poi: POI) => {
    updatePOI.mutate({
      id: poi.id,
      data: { isVisible: !poi.isVisible },
    });
  };

  const handleFormSubmit = (data: any) => {
    if (editingPOI) {
      updatePOI.mutate(
        { id: editingPOI.id, data },
        {
          onSuccess: () => setShowFormModal(false),
        }
      );
    } else {
      createPOI.mutate(data, {
        onSuccess: () => setShowFormModal(false),
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header title="Points of Interest" />

      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={handleAddPOI}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add POI
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {pois.length} POIs
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded text-sm ${
                  viewMode === 'split' ? 'bg-white dark:bg-gray-600 shadow' : ''
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded text-sm ${
                  viewMode === 'map' ? 'bg-white dark:bg-gray-600 shadow' : ''
                }`}
              >
                <MapIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded text-sm ${
                  viewMode === 'list' ?  'bg-white dark:bg-gray-600 shadow' : ''
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* POI List */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
            viewMode === 'list' ? 'w-full' : 'w-96'
          }`}>
            <POIList
              pois={pois}
              onSelect={setSelectedPOI}
              onAdd={handleAddPOI}
              onEdit={handleEditPOI}
              onDelete={handleDeletePOI}
              onToggleVisibility={handleToggleVisibility}
            />
          </div>
        )}

        {/* Map */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className="flex-1">
            <MapContainer className="h-full w-full" />
          </div>
        )}
      </div>

      {/* POI Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingPOI ? 'Edit POI' : 'Add New POI'}
        size="lg"
      >
        <POIForm
          poi={editingPOI || undefined}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowFormModal(false)}
          isLoading={createPOI.isPending || updatePOI.isPending}
        />
      </Modal>
    </div>
  );
}