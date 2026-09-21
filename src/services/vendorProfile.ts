import { supabase } from '../lib/supabaseClient';
import { VendorProfile } from '../types';

const LOCAL_STORAGE_KEY = 'vena-vendor-profile';

const DEFAULT_PROFILE: Omit<VendorProfile, 'id' | 'created_at' | 'updated_at'> = {
    hero_title: 'Capture Your Best Moments',
    hero_subtitle: 'Professional Photography & Videography Services',
    whatsapp_number: '',
    info_images: [],
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

export const getVendorProfile = async (): Promise<VendorProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('vendor_profiles')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (!error && data) {
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            } catch {}
            return data;
        }
    } catch (err) {
        console.warn('[vendorProfile] Supabase query skipped/failed, checking local fallback:', err);
    }

    // Fallback: check localStorage
    try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch {}

    // Default template if nothing exists yet
    return {
        id: 'default-vendor-profile',
        ...DEFAULT_PROFILE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
};

export const createOrUpdateVendorProfile = async (updates: Partial<VendorProfile>): Promise<VendorProfile> => {
    const existing = await getVendorProfile();

    if (existing && existing.id && existing.id !== 'default-vendor-profile') {
        try {
            const { data, error } = await supabase
                .from('vendor_profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', existing.id)
                .select()
                .maybeSingle();

            if (!error && data) {
                try {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
                } catch {}
                return data;
            }
            if (error) {
                console.warn('[vendorProfile] Supabase update failed, saving locally:', error);
            }
        } catch (err) {
            console.warn('[vendorProfile] Supabase update error, saving locally:', err);
        }

        // Fallback: update local storage
        const merged: VendorProfile = {
            ...existing,
            ...updates,
            updated_at: new Date().toISOString(),
        };
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        } catch {}
        return merged;
    } else {
        // Create new
        try {
            const { data, error } = await supabase
                .from('vendor_profiles')
                .insert([{ ...updates }])
                .select()
                .maybeSingle();

            if (!error && data) {
                try {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
                } catch {}
                return data;
            }
            if (error) {
                console.warn('[vendorProfile] Supabase insert failed, saving locally:', error);
            }
        } catch (err) {
            console.warn('[vendorProfile] Supabase insert error, saving locally:', err);
        }

        // Fallback: save to local storage
        const newProfile: VendorProfile = {
            id: crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
            hero_title: updates.hero_title || DEFAULT_PROFILE.hero_title,
            hero_subtitle: updates.hero_subtitle || DEFAULT_PROFILE.hero_subtitle,
            hero_image_url: updates.hero_image_url,
            whatsapp_number: updates.whatsapp_number || '',
            info_images: updates.info_images || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
        } catch {}
        return newProfile;
    }
};

export const uploadVendorImage = async (file: File, path: string): Promise<string> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('gallery-images')
            .upload(fileName, file);

        if (!uploadError) {
            const { data: urlData } = supabase.storage
                .from('gallery-images')
                .getPublicUrl(fileName);

            if (urlData?.publicUrl) {
                return urlData.publicUrl;
            }
        } else {
            console.warn('[vendorProfile] Supabase storage upload failed, falling back to base64:', uploadError);
        }
    } catch (err) {
        console.warn('[vendorProfile] Storage upload exception, falling back to base64:', err);
    }

    // Fallback to Base64 data URL
    return await fileToBase64(file);
};
