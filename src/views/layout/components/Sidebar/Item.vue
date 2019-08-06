<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      vnodes.push(<span class='item-title' slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
	.item-title {
		display: inline-block;
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
    line-height: 1;
		width: 90px;
	}
</style>
