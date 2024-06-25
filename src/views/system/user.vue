<template>
  <div class="user">
    <Table :columns="columns" :data="data" :operator="operator" />
  </div>
</template>

<script setup>
import Table from '@/components/Table';
const viewDetail = (row, index, data) => {
  console.log('viewDetail', row, index, data);
};
const edit = (row, index, data) => {
  console.log('edit', row, index, data);
};
const nullify = (row, index, data) => {
  console.log('nullify', row, index, data);
};
const columns = [
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'title',
    label: '名称',
  },
  {
    field: 'author',
    label: '作者',
  },
];
const data = [
  {
    id: 1,
    title: 'ceshi',
    author: 'a',
  },
  {
    id: 2,
    title: 'ceshi2',
    author: 'b',
  },
];
const operator = [
  {
    text: '查看',
    action: viewDetail,
    btnStyle: {
      text: false,
      link: false,
      color: '#626aef',
      icon: 'Edit',
    },
  },
  {
    text: '编辑',
    action: edit,
    btnStyle: {
      type: 'danger',
      text: false,
      link: false,
      icon: 'Search',
    },
  },
  {
    text: '删除',
    action: nullify,
    btnStyle: {
      text: false,
      link: false,
      plain: true,
      color: '#626aef',
      icon: 'Edit',
    },
  },
];
</script>

<style lang="scss" scoped></style>
