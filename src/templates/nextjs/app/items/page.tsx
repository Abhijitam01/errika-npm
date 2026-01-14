import { prisma } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { ItemList } from '@/components/ItemList';
import { CreateItemForm } from '@/components/CreateItemForm';

export const dynamic = 'force-dynamic';

async function getItems() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Items</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your items with full CRUD operations powered by Prisma.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
        <CreateItemForm />
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Items ({items.length})</h2>
        {items.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No items yet. Create your first item above!
            </p>
          </Card>
        ) : (
          <ItemList initialItems={items} />
        )}
      </div>
    </div>
  );
}

