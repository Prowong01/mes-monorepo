<template>
  <a-layout>
    <a-layout-content>
      <a-page-header title="Material List" />

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
            <a-button type="primary" @click="handleAdd">Add Material</a-button>
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
            :title="isEdit ? 'Edit Material' : 'Add Material'"
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
            <a-form-item label="Quantity">
              <a-input-number v-model:value="formState.quantity" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Unit Cost">
              <a-input-number v-model:value="formState.unit_cost" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Reorder Level">
              <a-input-number v-model:value="formState.reorder_level" style="width: 100%" />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { Material } from '../types';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a: Material, b: Material) => a.name.localeCompare(b.name),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    sorter: (a: Material, b: Material) => a.quantity - b.quantity,
    customRender: ({ text, record }: { text: number; record: Material }) => {
      const isLowQuantity = record.quantity < record.reorder_level;
      return h('span', {
        style: {
          color: isLowQuantity ? 'red' : 'inherit',
          fontWeight: isLowQuantity ? 'bold' : 'normal',
        },
      }, text);
    },
  },
  {
    title: 'Unit Cost (RM)',
    dataIndex: 'unit_cost',
    key: 'unit_cost',
    sorter: (a: Material, b: Material) => a.unit_cost - b.unit_cost,
  },
  {
    title: 'Reorder Level',
    dataIndex: 'reorder_level',
    key: 'reorder_level',
    sorter: (a: Material, b: Material) => a.reorder_level - b.reorder_level,
  },
  {
    title: 'Action',
    key: 'action',
    slots: { customRender: 'action' },
  },
];

const data = ref<Material[]>([]);
const visible = ref(false);
const isEdit = ref(false);
const currentMaterialId = ref<number | null>(null);
const searchText = ref('');

const filteredData = computed(() => {
  return data.value.filter(
      (material) =>
          material.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
          material.description.toLowerCase().includes(searchText.value.toLowerCase())
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

const formState = reactive<Material>({
  name: '',
  description: '',
  quantity: 0,
  unit_cost: 0,
  reorder_level: 0,
});

const fetchData = async () => {
  try {
    const response = await axios.get('/api/materials');
    data.value = response.data;
    pagination.value.total = response.data.length;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    message.error('Failed to fetch materials');
  }
};

const handleTableChange = (pag) => {
  pagination.value.current = pag.current;
  fetchData();
};

const handleAdd = () => {
  isEdit.value = false;
  formState.name = '';
  formState.description = '';
  formState.quantity = 0;
  formState.unit_cost = 0;
  formState.reorder_level = 0;
  visible.value = true;
};

const handleEdit = (record: Material) => {
  isEdit.value = true;
  currentMaterialId.value = record.id || null;
  formState.name = record.name;
  formState.description = record.description;
  formState.quantity = record.quantity;
  formState.unit_cost = record.unit_cost;
  formState.reorder_level = record.reorder_level;
  visible.value = true;
};

const handleDelete = async (id: number) => {
  try {
    await axios.delete(`/api/materials/${id}`);
    message.success('Material deleted successfully');
    fetchData();
  } catch (error) {
    console.error('Failed to delete material:', error);
    message.error('Failed to delete material');
  }
};

const handleSubmit = async () => {
  try {
    if (isEdit.value && currentMaterialId.value) {
      await axios.put(`/api/materials/${currentMaterialId.value}`, formState);
      message.success('Material updated successfully');
    } else {
      await axios.post('/api/materials', formState);
      message.success('Material created successfully');
    }
    visible.value = false;
    fetchData();
  } catch (error) {
    console.error('Failed to submit material:', error);
    message.error('Failed to submit material');
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
