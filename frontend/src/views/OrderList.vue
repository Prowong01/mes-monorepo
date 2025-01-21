<template>
  <a-layout>
    <a-layout-content>
      <a-page-header title="Production Order List" />

      <div className="px-5">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-input
                v-model:value="searchText"
                placeholder="Search by Product Name"
                @change="handleSearch"
            />
          </a-col>
          <a-col :span="16">
            <a-button type="primary" @click="handleAdd" :disabled="!isStockSufficient">Add Production Order</a-button>
          </a-col>
        </a-row>

        <a-table
            style="margin-top: 24px"
            :columns="columns"
            :data-source="filteredData"
            :pagination="pagination"
            @change="handleTableChange"
        >
          <template #status="{ text }">
            <a-tag :color="getStatusColor(text)">
              <span class="status-dot" :style="{ backgroundColor: getStatusColor(text) }"></span>
              {{ getStatusText(text) }}
            </a-tag>
          </template>
          <template #start_date="{ text }">
            {{ formatDate(text) }}
          </template>
          <template #end_date="{ text }">
            {{ formatDate(text) }}
          </template>
          <template #action="{ record }">
            <a-tooltip title="Edit">
              <a-button type="link" @click="handleEdit(record)">
                <template #icon>
                  <EditOutlined />
                </template>
              </a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip title="Delete">
              <a-button type="link" danger @click="handleDelete(record.id)">
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
            </a-tooltip>
          </template>
        </a-table>

        <a-modal
            v-model:visible="visible"
            :title="isEdit ? 'Edit Production Order' : 'Add Production Order'"
            @ok="handleSubmit"
            @cancel="handleCancel"
        >
          <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="Product Name">
              <a-select
                  v-model:value="formState.product_id"
                  placeholder="Select a product"
                  show-search
                  option-filter-prop="label"
                  :filter-option="filterProductOption"
              >
                <a-select-option
                    v-for="product in products"
                    :key="product.id"
                    :value="product.id"
                    :label="product.name"
                >
                  {{ product.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Quantity">
              <a-input-number v-model:value="formState.quantity" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Status">
              <a-select v-model:value="formState.status" placeholder="Please choose the production status">
                <a-select-option value="planned">Planned</a-select-option>
                <a-select-option value="in_progress">In Progress</a-select-option>
                <a-select-option value="completed">Completed</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Start Date">
              <a-date-picker v-model:value="formState.start_date" style="width: 100%" />
            </a-form-item>
            <a-form-item label="End Date">
              <a-date-picker v-model:value="formState.end_date" style="width: 100%" />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { formatDate } from '../utils/utils';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import {Material, Product, ProductionOrder } from '../types'

const columns = [
  {
    title: "Order ID",
    dataIndex: "order_id",
    key: "order_id",
    sorter: (a, b) => a.order_id - b.order_id, // 按 Order ID 排序
  },
  {
    title: "Product Name",
    dataIndex: "product_name",
    key: "product_name",
    sorter: (a, b) => a.product_name.localeCompare(b.product_name), // 按 Product Name 排序
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    sorter: (a, b) => a.quantity - b.quantity, // 按 Quantity 排序
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    slots: { customRender: "status" },
    sorter: (a, b) => a.status.localeCompare(b.status), // 按 Status 排序
  },
  {
    title: "Start Date",
    dataIndex: "start_date",
    key: "start_date",
    slots: { customRender: "start_date" },
    sorter: (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(), // 按 Start Date 排序
  },
  {
    title: "End Date",
    dataIndex: "end_date",
    key: "end_date",
    slots: { customRender: "end_date" },
    sorter: (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime(), // 按 End Date 排序
  },
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];

const products = ref<Product[]>([]);
const materials = ref<Material[]>([]);
const data = ref<ProductionOrder[]>([]);
const visible = ref(false);
const isEdit = ref(false);
const currentOrderId = ref<number | null>(null);

const searchText = ref("");

const filteredData = computed(() => {
  return data.value.filter((order) =>
      order.product_name?.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const handleSearch = () => {
  pagination.value.current = 1;
};

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

const formState = reactive<ProductionOrder>({
  product_id: null,
  quantity: 0,
  status: "planned",
  start_date: null,
  end_date: null,
});

const fetchData = async () => {
  try {
    const response = await axios.get("/api/order");
    const orders = response.data;

    const ordersWithProductName = await Promise.all(
        orders.map(async (order) => {
          const productResponse = await axios.get(`/api/products/${order.product_id}`);
          return {
            ...order,
            product_name: productResponse.data.name || "N/A",
            order_id: order.id
          };
        })
    );

    data.value = ordersWithProductName;
    pagination.value.total = ordersWithProductName.length;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    message.error("Failed to fetch production orders");
  }
};

const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/products");
    products.value = response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    message.error("Failed to fetch products");
  }
};

const fetchMaterials = async () => {
  try {
    const response = await axios.get("/api/materials");
    materials.value = response.data;
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    message.error("Failed to fetch materials");
  }
};

const handleTableChange = (pag) => {
  pagination.value.current = pag.current;
  fetchData();
};

const handleAdd = () => {
  isEdit.value = false;
  visible.value = true;
};

const handleEdit = (record: ProductionOrder) => {
  isEdit.value = true;
  currentOrderId.value = record.id || null;
  formState.product_id = record.product_id;
  formState.quantity = record.quantity;
  formState.status = record.status;
  formState.start_date = record.start_date ? dayjs(record.start_date) : null;
  formState.end_date = record.end_date ? dayjs(record.end_date) : null;
  visible.value = true;
};

const handleDelete = async (id: number) => {
  try {
    await axios.delete(`/api/order/${id}`);
    message.success("Production order deleted successfully");
    fetchData();
  } catch (error) {
    console.error("Failed to delete production order:", error);
    message.error("Failed to delete production order");
  }
};

const handleSubmit = async () => {
  try {
    const payload = {
      ...formState,
      start_date: formState.start_date ? dayjs(formState.start_date).format('YYYY-MM-DD HH:mm:ss') : null,
      end_date: formState.end_date ? dayjs(formState.end_date).format('YYYY-MM-DD HH:mm:ss') : null,
    };

    console.log('payload:', payload);

    if (isEdit.value && currentOrderId.value) {
      await axios.put(`/api/order/${currentOrderId.value}`, payload);
      message.success("Production order updated successfully");
    } else {
      await axios.post("/api/order", payload);
      message.success("Production order created successfully");
    }
    visible.value = false;
    fetchData();
  } catch (error) {
    console.error("Failed to submit production order:", error);
    message.error("Failed to submit production order, as the material stock is not enough");
  }
};

const isStockSufficient = computed(() => {
  if (!formState.product_id || !formState.quantity) return true;

  const product = products.value.find((p) => p.id === formState.product_id);
  if (!product) return true;

  for (const requiredMaterial of product.required_materials) {
    const material = materials.value.find((m) => m.id === requiredMaterial.material_id);
    if (!material || material.quantity < requiredMaterial.quantity * formState.quantity) {
      return false;
    }
  }

  return true;
});

const handleCancel = () => {
  visible.value = false;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "green";
    case "in_progress":
      return "orange";
    case "planned":
      return "blue";
    default:
      return "gray";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    case "planned":
      return "Planned";
    default:
      return status;
  }
};

onMounted(() => {
  fetchData();
  fetchProducts();
  fetchMaterials();
});
</script>

<style scoped>
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
