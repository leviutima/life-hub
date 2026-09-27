import { randomUUID } from 'node:crypto';

/**
 * Base de toda entidade de dominio.
 *
 * Nao conhece Nest, Prisma nem HTTP: so identidade e igualdade. As props ficam
 * protegidas para que a entidade seja a unica dona das suas invariantes.
 */
export abstract class Entity<Props> {
  private readonly _id: string;
  protected readonly props: Props;

  protected constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get id(): string {
    return this._id;
  }

  equals(other: Entity<unknown>): boolean {
    return this === other || this._id === other.id;
  }
}
