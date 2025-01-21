<template>
  <a-layout>
    <a-layout-content>
      <a-page-header title="Production Tracking List" />

      <div className="px-5">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-button type="primary" @click="handleAdd">Add Production Tracking</a-button>
          </a-col>
        </a-row>

        <a-table
            style="margin-top: 24px"
            :columns="columns"
            :data-source="data"
            :pagination="pagination"
            @change="handleTableChange"
        >
          <!-- 自定义状态列 -->
          <template #status="{ text }">
            <a-tag :color="getStatusColor(text)">
              <span class="status-dot" :style="{ backgroundColor: getStatusColor(text) }"></span>
              {{ getStatusText(text) }}
            </a-tag>
          </template>

          <!-- 自定义操作列 -->
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
            :title="isEdit ? 'Edit Production Tracking' : 'Add Production Tracking'"
            @ok="handleSubmit"
            @cancel="handleCancel"
        >
          <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="Order ID">
              <a-input v-model:value="formState.order_id" />
            </a-form-item>
            <a-form-item label="Machine ID">
              <a-input v-model:value="formState.machine_id" />
            </a-form-item>
            <a-form-item label="Operator ID">
              <a-input v-model:value="formState.operator_id" />
            </a-form-item>
            <a-form-item label="Status">
              <a-select v-model:value="formState.status" placeholder="Please choose the tracking status">
                <a-select-option value="raw_material_loaded">Raw Material Loaded</a-select-option>
                <a-select-option value="in_progress">In Progress</a-select-option>
                <a-select-option value="completed">Completed</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";

interface ProductionTracking {
  id?: number;
  order_id: number;
  machine_id: number;
  operator_id: number;
  status: string;
}

const columns = [
  {
    title: "Order ID",
    dataIndex: "order_id",
    key: "order_id",
    sorter: (a, b) => a.order_id - b.order_id,
  },
  {
    title: "Machine ID",
    dataIndex: "machine_id",
    key: "machine_id",
    sorter: (a, b) => a.machine_id - b.machine_id,
  },
  {
    title: "Operator ID",
    dataIndex: "operator_id",
    key: "operator_id",
    sorter: (a, b) => a.operator_id - b.operator_id,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    slots: { customRender: "status" }, // 使用 slots 定义插槽
  },
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" }, // 使用 slots 定义插槽
  },
];

const data = ref<ProductionTracking[]>([]);
const visible = ref(false);
const isEdit = ref(false);
const currentTrackingId = ref<number | null>(null);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

const formState = reactive<ProductionTracking>({
  order_id: 0,
  machine_id: 0,
  operator_id: 0,
  status: "raw_material_loaded",
});

const fetchData = async () => {
  try {
    const response = await axios.get("/api/order/tracking");
    data.value = response.data;
    pagination.value.total = response.data.length;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    message.error("Failed to fetch production tracking");
  }
};

const handleTableChange = (pag) => {
  pagination.value.current = pag.current;
  fetchData();
};

const handleAdd = () => {
  isEdit.value = false;
  formState.order_id = 0;
  formState.machine_id = 0;
  formState.operator_id = 0;
  formState.status = "raw_material_loaded";
  visible.value = true;
};

const handleEdit = (record: ProductionTracking) => {
  isEdit.value = true;
  currentTrackingId.value = record.id || null;
  formState.order_id = record.order_id;
  formState.machine_id = record.machine_id;
  formState.operator_id = record.operator_id;
  formState.status = record.status;
  visible.value = true;
};

const handleDelete = async (id: number) => {
  try {
    await axios.delete(`/api/order/tracking${id}`);
    message.success("Production tracking deleted successfully");
    fetchData();
  } catch (error) {
    console.error("Failed to delete production tracking:", error);
    message.error("Failed to delete production tracking");
  }
};

const handleSubmit = async () => {
  try {
    if (isEdit.value && currentTrackingId.value) {
      await axios.put(`/api/order/tracking/${currentTrackingId.value}`, formState);
      message.success("Production tracking updated successfully");
    } else {
      await axios.post("/api/order/tracking", formState);
      message.success("Production tracking created successfully");
    }
    visible.value = false;
    fetchData();
  } catch (error) {
    console.error("Failed to submit production tracking:", error);
    message.error("Failed to submit production tracking");
  }
};

const handleCancel = () => {
  visible.value = false;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "green";
    case "in_progress":
      return "orange";
    case "raw_material_loaded":
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
    case "raw_material_loaded":
      return "Raw Material Loaded";
    default:
      return status;
  }
};

onMounted(() => {
  fetchData();
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
