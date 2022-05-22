import { html, TemplateResult } from 'lit';
import '../src/meta-app.js';

export default {
  title: 'MetaApp',
  component: 'meta-app',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ title, backgroundColor = 'white' }: ArgTypes) => html`
  <meta-app style="--meta-app-background-color: ${backgroundColor}" .title=${title}></meta-app>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
