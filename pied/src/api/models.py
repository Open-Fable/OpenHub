from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional
from decimal import Decimal

@dataclass
class Category:
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[int] = None

@dataclass
class ProductVariant:
    id: int
    product_id: int
    sku: str
    size: Optional[str] = None
    color: Optional[str] = None
    stock_quantity: int = 0

@dataclass
class Product:
    id: int
    category_id: int
    name: str
    slug: str
    description: str
    technical_specs: str
    price: Decimal
    is_active: bool = True
    created_at: datetime = field(default_factory=datetime.now)
    variants: List[ProductVariant] = field(default_factory=list)

@dataclass
class Customer:
    id: int
    email: str
    password_hash: str
    first_name: str
    last_name: str
    address: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)

@dataclass
class OrderItem:
    id: int
    order_id: int
    variant_id: int
    quantity: int
    unit_price: Decimal

@dataclass
class Order:
    id: int
    customer_id: int
    total_amount: Decimal
    shipping_address: str
    order_date: datetime = field(default_factory=datetime.now)
    status: str = "En attente"
    items: List[OrderItem] = field(default_factory=list)

    def calculate_total(self):
        self.total_amount = sum(item.unit_price * item.quantity for item in self.items)
