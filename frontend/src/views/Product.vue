<template>
  <a-layout>
    <a-layout-content>
      <a-page-header title="Product List" />

      <div className="px-5">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-input
                v-model:value="searchText"
                placeholder="Search by Name or Description"
                @change="handleSearch"
            />
          </a-col>
          <a-col :span="16">
            <a-button type="primary" @click="handleAdd">Add Product</a-button>
          </a-col>
        </a-row>

        <a-table
            style="margin-top: 24px"
            :columns="columns"
            :data-source="filteredData"
            :pagination="pagination"
            @change="handleTableChange"
        >
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

            <!-- Material Selection Section -->
            <a-form-item label="Required Materials">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-select
                      v-model:value="selectedMaterial.material_id"
                      placeholder="Select Material"
                      style="width: 100%"
                  >
                    <a-select-option
                        v-for="material in materials"
                        :key="material.id"
                        :value="material.id"
                    >
                      {{ material.name }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="8">
                  <a-input-number
                      v-model:value="selectedMaterial.quantity"
                      placeholder="Quantity"
                      style="width: 100%"
                  />
                </a-col>
                <a-col :span="4">
                  <a-button type="primary" @click="addMaterial">Add</a-button>
                </a-col>
              </a-row>
            </a-form-item>

            <!-- Display Added Materials -->
            <a-form-item>
              <a-table
                  :columns="materialColumns"
                  :data-source="formState.required_materials"
                  :pagination="false"
              >
                <template #action="{ record, index }">
                  <a-button type="link" danger @click="removeMaterial(index)">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>
                </template>
              </a-table>
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
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";

interface Product {
  id?: number;
  name: string;
  description: string;
  unit_cost: number;
  production_time: number;
  required_materials: Array<{ material_id: number; quantity: number }>;
}

interface Material {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unit_cost: number;
  reorder_level: number;
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Unit Cost (RM)",
    dataIndex: "unit_cost",
    key: "unit_cost",
    sorter: (a: Product, b: Product) => a.unit_cost - b.unit_cost,
  },
  {
    title: "Production Time (Hour)",
    dataIndex: "production_time",
    key: "production_time",
    sorter: (a: Product, b: Product) => a.production_time - b.production_time,
  },
  {
    title: "Required Materials",
    key: "required_materials",
    customRender: ({ text, record }: { text: any; record: Product }) => {
      if (!record.required_materials || record.required_materials.length === 0) {
        return "N/A";
      }
      return record.required_materials
          .map((material) => {
            const materialName = materials.value.find((m) => m.id === material.material_id)?.name || `Material ${material.material_id}`;
            return `${materialName}: ${material.quantity}`;
          })
          .join(", ");
    },
  },
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];

const materialColumns = [
  {
    title: "Material",
    dataIndex: "material_id",
    key: "material_id",
    customRender: ({ text }: { text: number }) => {
      const material = materials.value.find((m) => m.id === text);
      return material ? material.name : `Material ${text}`;
    },
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];

const data = ref<Product[]>([]);
const materials = ref<Material[]>([]);
const visible = ref(false);
const isEdit = ref(false);
const currentProductId = ref<number | null>(null);
const searchText = ref("");

const selectedMaterial = reactive({
  material_id: null as number | null,
  quantity: 0,
});

const filteredData = computed(() => {
  return data.value.filter(
      (product) =>
          product.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
          product.description.toLowerCase().includes(searchText.value.toLowerCase())
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

const formState = reactive<Product>({
  name: "",
  description: "",
  unit_cost: 0,
  production_time: 0,
  required_materials: [],
});

const fetchData = async () => {
  try {
    const productsResponse = await axios.get("/api/products");
    data.value = productsResponse.data;
    pagination.value.total = productsResponse.data.length;
  } catch (error) {
    console.error("Failed to fetch data:", error);
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
  formState.name = "";
  formState.description = "";
  formState.unit_cost = 0;
  formState.production_time = 0;
  formState.required_materials = [];
  visible.value = true;
};

const handleEdit = (record: Product) => {
  isEdit.value = true;
  currentProductId.value = record.id || null;
  formState.name = record.name;
  formState.description = record.description;
  formState.unit_cost = record.unit_cost;
  formState.production_time = record.production_time;
  formState.required_materials = record.required_materials;
  visible.value = true;
};

const handleDelete = async (id: number) => {
  try {
    await axios.delete(`/api/products/${id}`);
    message.success("Product deleted successfully");
    fetchData();
  } catch (error) {
    console.error("Failed to delete product:", error);
    message.error("Failed to delete product, there is an order linked to this product");
  }
};

const addMaterial = () => {
  if (selectedMaterial.material_id && selectedMaterial.quantity > 0) {
    formState.required_materials.push({
      material_id: selectedMaterial.material_id,
      quantity: selectedMaterial.quantity,
    });
    selectedMaterial.material_id = null;
    selectedMaterial.quantity = 0;
  } else {
    message.warning("Please select a material and enter a valid quantity.");
  }
};

const removeMaterial = (index: number) => {
  formState.required_materials.splice(index, 1);
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
  fetchMaterials();
});
</script>

<style scoped>
</style>
