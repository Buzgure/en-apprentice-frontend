export function useStyle(type){
    if (typeof type == 'string') return bookOfStyles[type];
    else{
        const allStyles = type.map((t) => bookOfStyles[t]);
        return allStyles.flat();
    }
}