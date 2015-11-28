namespace jes.ast.builder {

    import ParseTree = pudu.parseTree.ParseTree
    import AstNode = pudu.ast.AstNode
    import NIL = pudu.ast.NIL
    import MATCH_CHILDREN = pudu.ast.builder.MATCH_CHILDREN
    import setParent = pudu.ast.builder.setParent
    import buildSyntaxBox = pudu.ast.builder.buildSyntaxBox

    import ObjectPT = jes.parser.ObjectPT
    import ValuePT = jes.parser.ValuePT
    import StringLiteral = jes.lexer.StringLiteral
    import NumberLiteral = jes.lexer.NumberLiteral
    import NullLiteral = jes.lexer.NullLiteral
    import TrueLiteral = jes.lexer.TrueLiteral
    import FalseLiteral = jes.lexer.FalseLiteral
    import ArrayPT = jes.parser.ArrayPT
    import SyntaxBoxPT = pudu.parseTree.SyntaxBoxPT
    import ObjectItemPT = jes.parser.ObjectItemPT

    export function buildObjectNode(tree:ParseTree):ObjectNode {
        let objectItemNodes = []
        let syntaxBox = []

        MATCH_CHILDREN(tree,
            {CASE: ObjectItemPT, THEN: (childTree) => objectItemNodes.push(buildObjectItemNode(childTree))},
            {CASE: SyntaxBoxPT, THEN: (childTree) => syntaxBox = buildSyntaxBox(childTree)}
        )

        let objectNodeInstance = new ObjectNode(objectItemNodes, NIL, syntaxBox)
        setParent(objectNodeInstance)
        return objectNodeInstance
    }

    export function buildObjectItemNode(tree:ParseTree):ObjectItemNode {
        let key = undefined, value = undefined
        let syntaxBox = []

        // TODO: how to express mandatory properties? (or all must have matched?)
        MATCH_CHILDREN(tree,
            {CASE: StringLiteral, THEN: (childTree) => key = buildStringNode(childTree)},
            {CASE: ValuePT, THEN: (childTree) => value = buildValueNode(childTree)},
            {CASE: SyntaxBoxPT, THEN: (childTree) => syntaxBox = buildSyntaxBox(childTree)}
        )

        let objectItemNodeInstance = new ObjectItemNode(key, value, NIL, syntaxBox)
        setParent(objectItemNodeInstance)
        return objectItemNodeInstance
    }

    export function buildValueNode(tree:ParseTree):ValueNode {
        let valueInstance = undefined

        // TODO: how to express at least one must have matched?
        MATCH_CHILDREN(tree,
            {CASE: StringLiteral, THEN: (childTree) => valueInstance = buildStringNode(childTree)},
            {CASE: NumberLiteral, THEN: (childTree) => valueInstance = buildNumberNode(childTree)},
            {CASE: NullLiteral, THEN: (childTree) => valueInstance = buildNullNode(childTree)},
            {CASE: TrueLiteral, THEN: (childTree) => valueInstance = buildTrueNode(childTree)},
            {CASE: FalseLiteral, THEN: (childTree) => valueInstance = buildFalseNode(childTree)},
            {CASE: ObjectPT, THEN: (childTree) => valueInstance = buildObjectNode(childTree)},
            {CASE: ArrayPT, THEN: (childTree) => valueInstance = buildArrayNode(childTree)}
        )

        // no need for setParent here, it is set in one of the specific builders
        return valueInstance
    }

    export function buildArrayNode(tree:ParseTree):ArrayNode {
        let arrItems = []
        let syntaxBox = []

        MATCH_CHILDREN(tree,
            {CASE: ValuePT, THEN: (childTree) => arrItems.push(buildValueNode(childTree))},
            {CASE: SyntaxBoxPT, THEN: (childTree) => syntaxBox = buildSyntaxBox(childTree)}
        )

        let arrayNodeInstance = new ArrayNode(arrItems, NIL, syntaxBox)
        setParent(arrayNodeInstance)
        return arrayNodeInstance
    }

    export function buildStringNode(tree:ParseTree):StringNode {
        let orgStringVal = tree.payload.image
        let stringValWithoutQuotes = orgStringVal.substring(1, orgStringVal.length - 1);
        return new StringNode(stringValWithoutQuotes, NIL, [tree.payload])
    }

    export function buildNumberNode(tree:ParseTree):NumberNode {
        return new NumberNode(tree.payload.image, NIL, [tree.payload])
    }

    export function buildTrueNode(tree:ParseTree):TrueNode {
        return new TrueNode(NIL, [tree.payload])
    }

    export function buildFalseNode(tree:ParseTree):FalseNode {
        return new FalseNode(NIL, [tree.payload])
    }

    export function buildNullNode(tree:ParseTree):NullNode {
        return new NullNode(NIL, [tree.payload])
    }

}