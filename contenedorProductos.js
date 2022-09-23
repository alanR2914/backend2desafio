const fs = require("fs");

class Contenedor{
    constructor(nameFile){
        this.nameFile = nameFile;
    }

    save = async(product)=>{
        try {
            //leer el archivo existe
            if (fs.existsSync(this.nameFile)) {
                const contenido = await fs.promises.readFile(this.nameFile,"utf8");
                if(contenido){ 
                    const productos = JSON.parse(contenido);
                    const lastIdAdded = productos.reduce((acc,item)=>item.id > acc ? acc = item.id : acc, 0);
                    const newProduct={
                        id: lastIdAdded+1,
                        ...product
                    }
                    productos.push(newProduct);
                    await fs.promises.writeFile(this.nameFile,JSON.stringify(productos, null, 2 ))
                }else {
                         //si no existe contenido
                const newProduct={
                    id:1,
                    ...product,
                }  
                //creamos el archivo             
                await fs.promises.writeFile(this.nameFile, JSON.stringify ([newProduct]), null, 2);           
            }
        }else{
            //si el archivo no existe
            const newProduct={
                id:1,
                ...product
            }
            //creamos el archivo
            await fs.promises.writeFile(this.nameFile, JSON.stringify([newProduct], null, 2));
        }
            
        } catch (error) {
            console.log(error);
        }
    }
    getById = async(id)=>{
        try {
            if (fs.existsSync(this.nameFile)) {
                const contenido = await fs.promises.readFile(this.nameFile, "utf8");
                if(contenido){
                    const productos = JSON.parse(contenido);
                    const producto = productos.find(item=>item.id===id);
                    return producto
                }else{
                    return "esta vacio"
                }
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    getAll = async()=>{
        try {
            const contenido = await fs.promises.readFile(this.nameFile, "utf8");
            const productos = JSON.stringify(contenido);
            return productos
        } catch (error) {
            console.log(error)            
        }
    }

    deleteById = async(id)=>{
        try {
            const contenido = await fs.promises.readFile(this.nameFile, "utf8");
            const productos = JSON.parse(contenido);
            const newProducts = productos.filter(item=>item.id!==id);
            await fs.promises.writeFile(this.nameFile, JSON.stringify(newProducts, null, 2))
        } catch (error) {
            console.log(error)
        }
        
    }
    deleteAll = async()=>{
        try {
            await fs.promises.writeFile(this.nameFile, JSON.stringify([]));
        } catch (error) {
            console.log(error)            
        }        
    }
}

const listaProductos = new Contenedor("./productos.txt")
const producto1 = {
    title: "camisa",
    price: 300,
    thumbnail:"https://th.bing.com/th/id/R.740197d7bf60a0cb7e816c26b8769e32?rik=wbFuH3j%2biPJCXw&pid=ImgRaw&r=0"
}

const producto2 = {
    title: "bolso",
    price: 300,
    thumbnail:"https://th.bing.com/th/id/OIP.04ldgF3MIUOIjD_yyp6zfgHaHa?w=193&h=193&c=7&r=0&o=5&dpr=1.1&pid=1.7"
}

const producto3 = {
    title: "gorro",
    price: 300,
    thumbnail:"https://th.bing.com/th/id/OIP.km6AWyz6DklHAn5LfzSCsAHaGo?w=216&h=193&c=7&r=0&o=5&dpr=1.1&pid=1.7"
}

const crearProducto = async()=>{
    await listaProductos.save(producto1);
    await listaProductos.save(producto2);
    await listaProductos.save(producto3);
    const resultadoId = await listaProductos.getById(1)
    console.log(resultadoId)
    const productos = await listaProductos.getAll();
    console.log(productos)
    await listaProductos.deleteById(2);
    await listaProductos.save(producto2)
}
crearProducto()