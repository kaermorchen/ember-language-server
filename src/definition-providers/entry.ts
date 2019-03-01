import {
  RequestHandler,
  TextDocumentPositionParams,
  Definition
} from 'vscode-languageserver';

import Server from './../server';
import { getExtension } from './../utils/file-extension';
import TemplateDefinitionProvider from './template';
import ScriptDefinietionProvider from './script';

export default class DefinitionProvider {
  private template !: TemplateDefinitionProvider;
  private script !: ScriptDefinietionProvider;

  constructor(private server: Server) {
    this.template = new TemplateDefinitionProvider(server);
    this.script = new ScriptDefinietionProvider(server);
  }

  handle(params: TextDocumentPositionParams): Definition | null {
    let uri = params.textDocument.uri;

    const project = this.server.projectRoots.projectForUri(uri);

    if (!project) {
      return null;
    }

    let extension = getExtension(params.textDocument);

    if (extension === '.hbs') {
      return this.template.handle(params, project);
    } else if (extension === '.js') {
      return this.script.handle(params, project);
    } else {
      return null;
    }
  }

  get handler(): RequestHandler<TextDocumentPositionParams, Definition, void> {
    return this.handle.bind(this);
  }
}