export default {
    template: `
    <div>
        <strong class="ml-2 block">{{keyName}}:</strong><span class="ml-5 block">{{value}}</span>
    </div>
  `,
    props: ['keyName', 'value'],
}
