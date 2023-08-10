import { Ability, AbilityBuilder } from "@casl/ability";
import { Roles } from "@enums";

export function defineAbilitiesFor(role: string) {
  const { can, cannot, build } = new AbilityBuilder<Ability>();

  if (role === Roles.ADMIN) {
    can("access", "main");
  } else {
    cannot("access", "main");
  }

  return build();
}
