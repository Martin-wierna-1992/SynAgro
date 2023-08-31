# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## `El funcionamiento de la app se basa en un blog donde los usuarios pueden navegar en el blog sin necesidad de loguearse, en el logueo el usuario es capaz de comentar , ver y editar sus post. puede dar me gusta a otros blog y agregar comentarios. el backend corre en el puerto 8000 mediante json server el cual es el encargado de mapear las rutas y manejar los request. la validacion la realiza mediante jwt para validar q el usuario. Las diferentes pestañas como el view , edit , generate de post se realiza mediante react-router-dom y navigate el cual establece las rutas para el renderizado de componentes. el manejo de las state se realiza mediante context el cual administra las variables para poder ser utilizadas en todos los componentes que esten adentro de ese provider `

## `para la inicializacion del proyecto se debe realizar:`
`npm install`
`npm start`

## `para la inicializacion del backend se debe hacer:`
`npm install`
`npm run start-auth`