import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
    return new Promise((resolve, reject) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    'create table if not exists menuitems (id integer primary key not null, name text, price text, image text, description text, category text);'
                );
            },
            reject,
            resolve
        );
    });
}

export async function getMenuItems() {
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql('select * from menuitems', [], (_, { rows }) => {
                resolve([...rows]);
            });
        });
    });
}

export function saveMenuItems(menuItems) {
    db.transaction((tx) => {
        tx.executeSql(
            `insert into menuitems (name, price, image, description, category) values ${menuItems
                .map(
                    (item) => `("${item.name}", "${item.price}", "${item.image}", "${item.description}", "${item.category}")`
                )
                .join(', ')}`
        );
    });
}

export async function filterByQueryAndCategories(query, activeCategories) {
    console.log(query, activeCategories)
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql("select * from menuitems where category in (?, ?, ?) and name like (?)", [activeCategories[0]?.toLowerCase(), activeCategories[1]?.toLowerCase(), activeCategories[2]?.toLowerCase(), `%${query}%`], (_, { rows }) => {
                console.log(rows)
                resolve([...rows]);
            });
        });
    });
}
