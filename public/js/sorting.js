function sort(list, field, direction) {
	const compareFn = direction === 'asc'
	    ? ASC_COMPARING_FN(field)
	    : DESC_COMPARING_FN(field);
    return list.sort(compareFn);
}

function ASC_COMPARING_FN(field) {
	if(field === 'release_date'){
		return (a, b) => new Date(a[field]) - new Date(b[field]);
	}
	return (a, b) => a[field] - b[field];
}

function DESC_COMPARING_FN(field) {
	if(field === 'release_date'){
		return (a, b) => new Date(b[field]) - new Date(a[field]);
	}
	return (a, b) => b[field] - a[field];
}