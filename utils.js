import { useRef, useEffect } from 'react';


export function getSectionListData(data) {
    const dataByCategory = data.reduce((acc, curr) => {
        const menuItem = {
            id: curr.id,
            name: curr.name,
            price: curr.price,
            image: curr.image,
            description: curr.description
        };
        if (!Array.isArray(acc[curr.category])) {
            acc[curr.category] = [menuItem];
        } else {
            acc[curr.category].push(menuItem);
        }
        return acc;
    }, {});
    const sectionListData = Object.entries(dataByCategory).map(([key, item]) => {
        return {
            title: key,
            data: item,
        };
    });
    return sectionListData;
}

export function useUpdateEffect(effect, dependencies = []) {
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            return effect();
        }
    }, dependencies);
}
