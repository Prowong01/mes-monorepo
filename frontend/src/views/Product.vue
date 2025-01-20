<template>
  <a-layout>
    <a-layout-content>
      <a-page-header title="Product List" />

      <a-row :gutter="16">
        <a-col :span="24">
          <a-button type="primary" @click="handleAdd">Add Product</a-button>
        </a-col>
      </a-row>

      <a-table
          style="margin-top: 24px"
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          @change="handleTableChange"
      >
        <template #action="{ record }">
          <a @click="handleEdit(record)">Edit</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">Delete</a>
        </template>
      </a-table>

      <a-modal
          v-model:visible="visible"
          :title="isEdit ? 'Edit Product' : 'Add Product'"
          @ok="handleSubmit"
          @cancel="handleCancel"
      >
        <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-item label="Name">
            <a-input v-model:value="formState.name" />
          </a-form-item>
          <a-form-item label="Description">
            <a-input v-model:value="formState.description" />
          </a-form-item>
          <a-form-item label="Unit Cost">
            <a-input-number v-model:value="formState.unit_cost" style="width: 100%" />
          </a-form-item>
          <a-form-item label="Production Time">
            <a-input-number v-model:value="formState.production_time" style="width: 100%" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";

interface Product {
  id?: number;
  name: string;
  description: string;
  unit_cost: number;
  production_time: number;
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Unit Cost",
    dataIndex: "unit_cost",
    key: "unit_cost",
  },
  {
    title: "Production Time",
    dataIndex: "production_time",
    key: "production_time",
  },
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];

const data = ref<Product[]>([]);
const visible = ref(false);
const isEdit = ref(false);
const currentProductId = ref<number | null>(null);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

const formState = reactive<Product>({
  name: "",
  description: "",
  unit_cost: 0,
  production_time: 0,
});

const fetchData = async () => {
  try {
    const response = await axios.get("/api/products");
    data.value = response.data;
    pagination.value.total = response.data.length;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    message.error("Failed to fetch products");
  }
};

const handleTableChange = (pag) => {
  pagination.value.current = pag.current;
  fetchData();
};

const handleAdd = () => {
  isEdit.value = false;
  formState.name = "";
  formState.description = "";
  formState.unit_cost = 0;
  formState.production_time = 0;
  visible.value = true;
};

const handleEdit = (record: Product) => {
  isEdit.value = true;
  currentProductId.value = record.id || null;
  formState.name = record.name;
  formState.description = record.description;
  formState.unit_cost = record.unit_cost;
  formState.production_time = record.production_time;
  visible.value = true;
};

const handleDelete = async (id: number) => {
  try {
    await axios.delete(`/api/products/${id}`);
    message.success("Product deleted successfully");
    fetchData();
  } catch (error) {
    console.error("Failed to delete product:", error);
    message.error("Failed to delete product");
  }
};

const handleSubmit = async () => {
  try {
    if (isEdit.value && currentProductId.value) {
      await axios.put(`/api/products/${currentProductId.value}`, formState);
      message.success("Product updated successfully");
    } else {
      await axios.post("/api/products", formState);
      message.success("Product created successfully");
    }
    visible.value = false;
    fetchData();
  } catch (error) {
    console.error("Failed to submit product:", error);
    message.error("Failed to submit product");
  }
};

const handleCancel = () => {
  visible.value = false;
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
</style>