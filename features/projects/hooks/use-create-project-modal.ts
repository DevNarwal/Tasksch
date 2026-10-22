import {useQueryState , parseAsBoolean} from "nuqs";

export const useCreateProjectModal = ()=>{
    const [isOpen  , setisOpen] = useQueryState(
        "create-project",
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