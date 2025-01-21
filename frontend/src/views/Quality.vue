<template>
  <a-layout>
    <a-layout-content>
      <a-page-header title="Quality Control" />

      <div class="px-5">
        <!-- 搜索和添加按钮 -->
        <a-row :gutter="16">
          <a-col :span="8">
            <a-input
                v-model:value="searchText"
                placeholder="Search by Check Type"
                @change="handleSearch"
            />
          </a-col>
          <a-col :span="16">
            <a-button type="primary" @click="handleAdd">Add Quality Control</a-button>
          </a-col>
        </a-row>

        <!-- 表格 -->
        <a-table
            style="margin-top: 24px"
            :columns="columns"
            :data-source="filteredData"
            :pagination="pagination"
            @change="handleTableChange"
        >
          <!-- Order ID 列 -->
          <template #order_id="{ text }">
            <a @click="handleOrderClick(text)">{{ text }}</a>
          </template>

          <!-- Result 列 -->
          <template #result="{ text }">
            <a-tag :color="text === 'pass' ? 'green' : 'red'">
              {{ text === 'pass' ? 'Pass' : 'Fail' }}
            </a-tag>
          </template>

          <!-- Check Date 列 -->
          <template #check_date="{ text }">
            {{ formatDate(text) }}
          </template>

          <!-- Action 列 -->
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

        <!-- 添加/编辑模态框 -->
        <a-modal
            v-model:visible="visible"
            :title="isEdit ? 'Edit Quality Control' : 'Add Quality Control'"
            @ok="handleSubmit"
            @cancel="handleCancel"
        >
          <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="Order ID">
              <a-input-number v-model:value="formState.order_id" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Check Type">
              <a-input v-model:value="formState.check_type" />
            </a-form-item>
            <a-form-item label="Result">
              <a-select v-model:value="formState.result" placeholder="Select result">
                <a-select-option value="pass">Pass</a-select-option>
                <a-select-option value="fail">Fail</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Check Date">
              <a-date-picker v-model:value="formState.check_date" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Defect Details">
              <a-textarea v-model:value="formState.defect_details" />
            </a-form-item>
            <a-form-item label="Inspector ID">
              <a-input-number v-model:value="formState.inspector_id" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Notes">
              <a-textarea v-model:value="formState.notes" />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { message } from "ant-design-vue";
import { formatDate } from "../utils/utils";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { QualityCheck } from "../types";

const router = useRouter();

// 表格列定义
const columns = [
  {
    title: "Order ID",
    dataIndex: "order_id",
    key: "order_id",
    slots: { customRender: "order_id" }, // 使用自定义渲染
  },
  {
    title: "Check Type",
    dataIndex: "check_type",
    key: "check_type",
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
    slots: { customRender: "result" },
  },
  {
    title: "Check Date",
    dataIndex: "check_date",
    key: "check_date",
    slots: { customRender: "check_date" },
  },
  {
    title: "Defect Details",
    dataIndex: "defect_details",
    key: "defect_details",
  },
  {
    title: "Inspector ID",
    dataIndex: "inspector_id",
    key: "inspector_id",
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
  },
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];

// 数据状态
const data = ref<QualityCheck[]>([]);
const visible = ref(false);
const isEdit = ref(false);
const currentCheckId = ref<number | null>(null);
const searchText = ref("");

// 分页
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 表单状态
const formState = reactive<QualityCheck>({
  order_id: null,
  check_type: "",
  result: "pass",
  check_date: null,
  defect_details: "",
  inspector_id: null,
  notes: "",
});

// 过滤数据
const filteredData = computed(() => {
  return data.value.filter((check) =>
      check.check_type?.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

// 获取数据
const fetchData = async () => {
  try {
    const response = await axios.get("/api/quality");
    data.value = response.data;
    pagination.value.total = response.data.length;
  } catch (error) {
    console.error("Failed to fetch quality controls:", error);
    message.error("Failed to fetch quality controls");
  }
};

// 处理搜索
const handleSearch = () => {
  pagination.value.current = 1;
};

// 处理分页
const handleTableChange = (pag) => {
  pagination.value.current = pag.current;
  fetchData();
};

// 处理 Order ID 点击
const handleOrderClick = (orderId: number) => {
  router.push(`/order/${orderId}`); // 跳转到订单页面
};

// 打开添加模态框
const handleAdd = () => {
  isEdit.value = false;
  formState.order_id = null;
  formState.check_type = "";
  formState.result = "pass";
  formState.check_date = null;
  formState.defect_details = "";
  formState.inspector_id = null;
  formState.notes = "";
  visible.value = true;
};

// 打开编辑模态框
const handleEdit = (record: QualityCheck) => {
  isEdit.value = true;
  currentCheckId.value = record.id;
  formState.order_id = record.order_id;
  formState.check_type = record.check_type;
  formState.result = record.result;
  formState.check_date = record.check_date ? dayjs(record.check_date) : null;
  formState.defect_details = record.defect_details;
  formState.inspector_id = record.inspector_id;
  formState.notes = record.notes;
  visible.value = true;
};

// 处理提交
const handleSubmit = async () => {
  try {
    const payload = {
      ...formState,
      check_date: formState.check_date ? dayjs(formState.check_date).toISOString() : null,
    };

    if (isEdit.value && currentCheckId.value) {
      await axios.put(`/api/quality/${currentCheckId.value}`, payload);
      message.success("quality control updated successfully");
    } else {
      await axios.post("/api/quality", payload);
      message.success("quality control created successfully");
    }
    visible.value = false;
    fetchData();
  } catch (error) {
    console.error("Failed to submit quality control:", error);
    message.error("Failed to submit quality control");
  }
};

// 处理删除
const handleDelete = async (id: number) => {
  try {
    await axios.delete(`/api/quality/${id}`);
    message.success("quality control deleted successfully");
    fetchData();
  } catch (error) {
    console.error("Failed to delete quality control:", error);
    message.error("Failed to delete quality control");
  }
};

// 处理取消
const handleCancel = () => {
  visible.value = false;
};

// 初始化
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
