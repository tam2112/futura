'use server';

import { deleteCategories } from '@/lib/actions/category.action';
import { revalidatePath } from 'next/cache';

export async function deleteSelectedCategories(formData: FormData) {
    const selectedIds = formData.getAll('selectedIds') as string[];
    console.log('Selected IDs:', selectedIds);
    if (selectedIds.length === 0) {
        return { error: 'Please select at least one category to delete.' };
    }

    const result = await deleteCategories({ success: false, error: false }, selectedIds);
    if (result.success) {
        // Revalidate danh sách categories
        revalidatePath('/list/categories');
        return {
            success: true,
            message: `Successfully deleted ${selectedIds.length} ${
                selectedIds.length === 1 ? 'category' : 'categories'
            }.`,
            count: selectedIds.length,
        };
    } else {
        return { error: 'Failed to delete categories.' };
    }
}
