const { ROOT_CONTENT_TYPES } = require('./../external/constants');

function getRootCodenamesOfSingleItem(item, allItems) {
    if (ROOT_CONTENT_TYPES.includes(item.type)) {
        return [item.codename];
    }

    return getRootParents(item.codename, allItems);
}

function getRootParents(codename, allItems) {
    let itemsToVisit = getDirectParents(codename, allItems);
    const visitedItems = [];
    const rootItemCodenames = [];

    while (itemsToVisit.length > 0) {
        const newItemsToVisit = [];

        itemsToVisit.forEach(item =>
            processItem(item, { visitedItems, rootItemCodenames, newItemsToVisit, allItems }));

        itemsToVisit = newItemsToVisit;
    }

    return rootItemCodenames;
}

function processItem(item, context) {
    const itemCodename = item.system.codename;

    if (context.visitedItems.includes(itemCodename)) {
        return;
    }
    context.visitedItems.push(itemCodename);

    if (ROOT_CONTENT_TYPES.includes(item.system.type)) {
        context.rootItemCodenames.push(itemCodename);
    } else {
        const parents = getDirectParents(itemCodename, context.allItems);
        parents.forEach(item => context.newItemsToVisit.push(item));
    }
}

function getDirectParents(codename, allItems) {
    return allItems.filter(item => checkIfItemIsParent(item, codename));
}

function checkIfItemIsParent(item, codename) {
    switch (item.system.type) {
        case 'code_samples':
            return item.codeSamples.value.map(m => m.system.codename).includes(codename);
        case 'article':
        case 'scenario':
            return item.content.linkedItemCodenames.includes(codename) ||
                item.introduction.linkedItemCodenames.includes(codename);
        case 'callout':
        case 'content_chunk':
            return item.content.linkedItemCodenames.includes(codename);
        default:
            return false;
    }
}

module.exports = getRootCodenamesOfSingleItem;
