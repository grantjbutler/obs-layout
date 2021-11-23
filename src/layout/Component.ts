import { v4 as uuidv4 } from 'uuid';

export default class Component {
  id: string = uuidv4()
  children: Component[] = []

  get name(): string {
    throw new Error('Subclasses are expected to override this method.')
  }

  get viewComponent(): string {
    throw new Error('Subclasses are expected to override this method.')
  }

  get controlsComponent(): string {
    throw new Error('Subclasses are expected to override this method.')
  }
}