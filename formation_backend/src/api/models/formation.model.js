/**
  * 
  idF, nomF, durée (int) , prix(decimal) , type, Formateur, datedebut
Classe facultative associée : participants
  */
module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  let FormationSchema = new Schema(
    {
      nomF: { type: String, required: true },
      duree: { type: String, required: true },
      prix: { type: String, required: true },
      type: { type: String },
      image: { type: String },
      dateDebut: { type: Date },
      formateur: { type: mongoose.Types.ObjectId, ref: "User" },
      participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      created: { type: Date, default: new Date() },
      lastUpdate: { type: Date },
    },
    {
      timestamps: true,
    }
  );
  FormationSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Formation = mongoose.model("Formation", FormationSchema);
  return Formation;
};
