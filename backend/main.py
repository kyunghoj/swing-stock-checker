
import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Allow CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Product(BaseModel):
    name: str
    price: str
    price_numeric: int
    product_type: str
    image_url: str
    product_url: str

BASE_URL = "https://www.swingguitars.com"
SHOP_PAGE_URL = f"{BASE_URL}/612"

def scrape_products() -> List[Product]:
    products = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    # Scrape the first 5 pages
    for page in range(1, 6):
        url = f"{SHOP_PAGE_URL}?page={page}&sort=recent"
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
        except requests.RequestException as e:
            continue

        soup = BeautifulSoup(response.text, 'html.parser')
        items = soup.select('.shop-item._shop_item')

        if not items:
            break

        for item in items:
            sold_out_div = item.select_one('.prod_icon.sold_out')
            if sold_out_div:
                continue

            name_element = item.select_one('h2.shop-title')
            price_element = item.select_one('p.pay')
            img_element = item.select_one('img._org_img')
            link_element = item.select_one('a.shop-item-thumb')

            if name_element and price_element and img_element and link_element:
                name = name_element.text.strip()
                price_str = price_element.text.strip()
                
                # Convert price to numeric
                try:
                    price_numeric = int(price_str.replace('원', '').replace(',', ''))
                except (ValueError, TypeError):
                    continue

                # Determine product type
                product_type = 'bass' if '베이스' in name else 'guitar'

                product_path = link_element.get('href')
                full_product_url = f"{BASE_URL}{product_path}" if product_path.startswith('/') else product_path
                image_url = img_element.get('data-original') or img_element.get('src')

                product_data = Product(
                    name=name,
                    price=price_str,
                    price_numeric=price_numeric,
                    product_type=product_type,
                    image_url=image_url,
                    product_url=full_product_url
                )
                products.append(product_data)

    return products

@app.get("/api/products", response_model=List[Product])
def get_products():
    """
    API endpoint to get a list of products that are not sold out.
    """
    return scrape_products()

