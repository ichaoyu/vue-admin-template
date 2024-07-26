<script lang="ts">
import { TableColumn } from './types';

export default defineComponent({
  name: 'RenderCol',
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render(ctx: TableColumn) {
    const params: any = {
      row: ctx.row,
      index: ctx.index,
    };
    if (ctx.column) params.column = ctx.column;
    return ctx.render(ctx?.row[ctx?.column?.key], ctx.row, ctx.index);
  },
});
</script>
