//import Product_State from "./Product_State.js"; import Category from "./Category.js";
export default class Product {
    static db = "http://localhost:3000";
    //static product_states = new Map(); //Preload Product_states if a new State is created
    constructor(id, name, category_id, price, stock, description, images, product_state) {
        this.id = id;
        this.name = name;
        let validationCategory = Product.validation(category_id, 'categories');
        validationCategory.then(async () => {
            if (await validationCategory === true) {
                this.category_id = category_id;
            } else {
                this.category_id = null;
            }
        })
        this.price = price;
        this.stock = stock;
        this.description = description;
        this.images = images;
    }

    static async getAllProduct() {
        try {
            const response = await fetch(Product.db + "/products/", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            if (!response.ok) {
                return new Error(`HTTP Error! ${response.status}`);
            }
            data = await response.json();
            for(const p of data){
                Product.products.set(p?.id, new Product(p?.id, p?.name, p?.category_id, p?.price, p?.stock, p?.description, p?.images, p?.product_state));
            }
            return data.map(p => new Product(p?.id, p?.name, p?.category_id, p?.price, p?.stock, p?.description, p?.images, p?.product_state));

        } catch (error) {
            console.error("error", error)
        }

    }

    static async getProductById(idProduct) {
        const product = Product.products.get(idProduct) ?? null; //Simple verification for product inside memory
        if(product !== null){
            return product
        }
        try {
            const response = await fetch(Product.db + "/products/" + idProduct, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            if (!response.ok) {
                return new Error(`HTTP Error! ${response.status}`);
            }
            p = await response.json();
            const product = new Product(p?.id, p?.name, p?.category_id, p?.price, p?.stock, p?.description, p?.images, p?.product_state);
            Product.products.set(product.id, product)
            return product;

        } catch (error) {
            console.error("error", error)
            return null
        }
    }

    static async createProduct(Prod) {
        try {
            const response = await fetch(Product.db + "/products/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Prod)
            })
            if (!response.ok) {
                return new Error(`HTTP ERROR!, ${response.status}`)
            }
            data = await response.json();

            return data.map(p => new Product(p?.id, p?.name, p?.category_id, p?.price, p?.stock, p?.description, p?.images, p?.product_state));

        } catch (error) {
            console.error("error", error)
        }
    }

    static async editProductById({name, category_id, price, stock, description, images, product_state}, idProduct) {
        const product = await Product.getProductById(idProduct);
        product.name = name ?? product.name;    product.category_id = category_id ?? product.category_id;   product.price = price ?? product.price;
        product.stock = stock ?? product.stock; product.description = description ?? product.description;   product.images = images ?? product.images;
        product.product_state = product_state ?? product.product_state;
        try {
            const response = await fetch(Product.db + "/products/" + idProduct, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            })
            if (!response.ok) {
                throw new Error(`HTTP ERROR!, ${response.status}`)
            }
            const data = await response.json();
            return data;

        } catch (error) {
            console.error("error", error)
            return null //Return in case of Error
        }
    }

    static async deleteProductById(idProduct) {
        try {
            const response = await fetch(Product.db+"/products/"+idProduct, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })
            if (!response.ok) {
                throw new Error(`HTTP ERROR!, ${response.status}`)
            }
            return true;

        } catch (error) {
            console.error("error", error)
            return false
        }
    }

    static async validation(id, url) {
        if(Product.categories.size === 0){

        }
        if (url === 'categories') {
            if (id > 4 || id <= 0) {
                return false;
            }
        }
        if (url === 'product_state') {
            if (id > 3 || id <= 0) {
                return false;
            }
        }
        try {
            const response = await fetch(`http://localhost:3000/${url}/${id}`);
            if (!response.ok) {
            }
            const data = await response.json();
            if (!data || Object.keys(data).length === 0) {
                // console.log('no hay referencia');
                return false;
            }
            // console.log(data);
            return true;
        } catch (error) {
            console.error('Error:', error.message);
            return false;
        }
    }
    static get categories(){
        return Category.categories;
    }
    static get states(){
        return Product_State.states;
    } 
}