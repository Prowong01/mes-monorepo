<template>
  <a-layout>
    <a-layout-content>
      <a-page-header title="Production Order List" />

      <a-row :gutter="16">
        <a-col :span="8">
<!--          <a-card>-->
<!--            <p>我的待办</p>-->
<!--            <h2>8个任务</h2>-->
<!--          </a-card>-->
<!--        </a-col>-->
<!--        <a-col :span="8">-->
<!--          <a-card>-->
<!--            <p>本周任务平均处理时间</p>-->
<!--            <h2>32分钟</h2>-->
<!--          </a-card>-->
<!--        </a-col>-->
<!--        <a-col :span="8">-->
<!--          <a-card>-->
<!--            <p>本周完成任务数</p>-->
<!--            <h2>24个</h2>-->
<!--          </a-card>-->
        </a-col>
      </a-row>

      <a-row style="margin-top: 24px">
        <a-col>
          <a-button type="primary" @click="handleAdd">Add</a-button>
        </a-col>
      </a-row>

      <a-table
          style="margin-top: 24px"
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          @change="handleTableChange"
      >
        <template #owner="{ text }">
          <a-tag color="blue">{{ text }}</a-tag>
        </template>
        <template #action>
          <a>Edit</a>
          <a-divider type="vertical" />
          <a>More</a>
        </template>
      </a-table>

      <a-modal
          v-model:visible="visible"
          title="Add Production Order"
          @ok="handleSubmit"
          @cancel="handleCancel"
      >
        <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-item label="Product ID">
            <a-input v-model:value="formState.product_id" />
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
          <a-form-item label="Time Begin">
            <a-date-picker v-model:value="formState.start_date" style="width: 100%" />
          </a-form-item>
          <a-form-item label="Time End">
            <a-date-picker v-model:value="formState.end_date" style="width: 100%" />
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

interface FormState {
  product_id: number | null;
  quantity: number;
  status: string;
  start_date: Date | null;
  end_date: Date | null;
}

const columns = [
  {
    title: "任务",
    dataIndex: "task",
    key: "task",
  },
  {
    title: "负责人",
    dataIndex: "owner",
    key: "owner",
    slots: { customRender: "owner" },
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "进度",
    dataIndex: "progress",
    key: "progress",
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

const data = ref([]);
const visible = ref(false);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

const formState = reactive<FormState>({
  product_id: null,
  quantity: 0,
  status: "planned",
  start_date: null,
  end_date: null,
});

const fetchData = async () => {
  try {
    const response = await axios.get("/api/production/production-orders");
    data.value = response.data;
    pagination.value.total = response.data.length;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

const handleTableChange = (pag) => {
  pagination.value.current = pag.current;
  fetchData();
};

const handleAdd = () => {
  visible.value = true;
};

const handleSubmit = async () => {
  try {
    await axios.post("/api/production/production-orders", formState);
    message.success("订单创建成功");
    visible.value = false;
    fetchData();
  } catch (error) {
    console.error("Failed to create order:", error);
    message.error("订单创建失败");
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
