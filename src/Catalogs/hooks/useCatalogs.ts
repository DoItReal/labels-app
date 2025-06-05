// hooks/useCatalogs.ts
import { useEffect, useState } from 'react';
import {
    createCatalogDB,
    deleteCatalogDB
} from '../../DB/Remote/Catalogs';
import {
    newCatalog,
    deleteCatalogLocally,
    loadCatalog,
    catalogToLoadedCatalog,
    getSelectedCatalog,
    loadCatalogsLocally,
    updateCatalogsLocally,
    getCatalogs
} from '../../DB/SessionStorage/Catalogs';
import { Icatalog, IloadedCatalog, Icatalogs } from '../../DB/Interfaces/Catalogs';

export const useCatalogs = () => {
    const [catalogs, setCatalogs] = useState<Icatalogs>();
    const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
    const [previewingCatalogId, setPreviewingCatalogId] = useState<string | null>(null);
    const [loadedCatalog, setLoadedCatalog] = useState<IloadedCatalog | null>(null);
    const [renamingCatalogId, setRenamingCatalogId] = useState<string | null>(null);
    const [renamingCatalogName, setRenamingCatalogName] = useState('');
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [newCatalogName, setNewCatalogName] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const cats = getCatalogs();
        if (cats) setCatalogs(cats);
    }, []);

    useEffect(() => {
        if (editingCatalogId) {
            catalogToLoadedCatalog(editingCatalogId).then(setLoadedCatalog).catch(console.error);
        }
    }, [editingCatalogId]);

    useEffect(() => {
        if (previewingCatalogId) {
            catalogToLoadedCatalog(previewingCatalogId).then(setLoadedCatalog).catch(console.error);
        }
    }, [previewingCatalogId]);

    const setCatalog = async (catalog: Icatalog) => {
        if (!catalogs) return;
        const updatedCatalogs = {
            ...catalogs,
            [catalog._id]: catalog,
        };
        setCatalogs(structuredClone(updatedCatalogs));
        await updateCatalogsLocally(updatedCatalogs);

        if (loadedCatalog?._id === catalog._id) {
            const updated = await catalogToLoadedCatalog(catalog._id);
            setLoadedCatalog(updated);
        }
    };

    const handleAddCatalog = async () => {
        const catalog = newCatalog([]);
        const updatedCatalog = { ...catalog, name: newCatalogName };
        const loaded = await catalogToLoadedCatalog(updatedCatalog);
        const saved = await createCatalogDB(loaded);
        if (!saved) return;

        const newCatalogs = { ...catalogs, [saved._id]: saved };
        setCatalogs(newCatalogs);
        await updateCatalogsLocally(newCatalogs);
        handleClose();
    };

    const handleDeleteCatalog = (id: string) => {
        deleteCatalogLocally(id);
        if (catalogs) delete catalogs[id];
        setCatalogs({ ...catalogs });
        deleteCatalogDB(id);

        const selected = getSelectedCatalog();
        if (selected?._id === id && id !== '1') sessionStorage.removeItem('labels');
    };

    const handleRenameCatalog = (id: string, newName: string) => {
        if (!catalogs) return;
        const updated = {
            ...catalogs,
            [id]: { ...catalogs[id], name: newName },
        };
        setCatalogs(updated);
        updateCatalogsLocally(updated);
        setRenamingCatalogId(null);
    };

    const handleClose = () => setOpen(false);
    const toggleMenu = () => setMenuCollapsed((prev) => !prev);

    const handleDoubleClick = (id: string, name: string) => {
        setRenamingCatalogId(id);
        setRenamingCatalogName(name);
    };

    const handlePreviewCatalog = async (catalog: Icatalog) => {
        const loaded = await loadCatalog(catalog._id);
        setLoadedCatalog(loaded);
        setPreviewingCatalogId(catalog._id);
        setEditingCatalogId(null);
        setMenuCollapsed(true);
    };

    const handleEditCatalog = async (catalog: Icatalog) => {
        const loaded = await loadCatalog(catalog._id);
        setLoadedCatalog(loaded);
        setEditingCatalogId(catalog._id);
        setPreviewingCatalogId(null);
        setMenuCollapsed(true);
    };

    return {
        catalogs,
        setCatalogs,
        editingCatalogId,
        setEditingCatalogId,
        previewingCatalogId,
        setPreviewingCatalogId,
        loadedCatalog,
        setLoadedCatalog,
        renamingCatalogId,
        renamingCatalogName,
        newCatalogName,
        menuCollapsed,
        open,
        setOpen,
        setNewCatalogName,
        toggleMenu,
        handleAddCatalog,
        handleDeleteCatalog,
        handleRenameCatalog,
        handleClose,
        handleDoubleClick,
        handlePreviewCatalog,
        handleEditCatalog,
        setRenamingCatalogId,
        setRenamingCatalogName,
        setCatalog
    };
};