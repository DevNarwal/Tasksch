import {useQueryState , parseAsBoolean} from "nuqs";

export const useCreateWorkspaceModal = ()=>{
    const [isOpen  , setisOpen] = useQueryState(
        "create-workspace",
        parseAsBoolean.withDefault(false).withOptions({clearOnDefault:true})
    );

    const open = ()=>setisOpen(true);
    const close = ()=> setisOpen(false);

    return {
        isOpen,
        open,
        close,
        setisOpen

    };
};