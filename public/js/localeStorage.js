const getItem = (name) => {
	return JSON.parse(localStorage.getItem(`${name}`));
}

const setItem = (name, value) => {
	localStorage.setItem(`${name}`, JSON.stringify(value));
}

const getAllItems = () => {
	return {...localStorage};
}
